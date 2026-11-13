// Browser-only helper: "@imgly/background-removal" er jaygay eta import korbe.
// Ager `removeBackground(file, { ... })` er moto-i kaj kore, kintu:
//  - package ta shudhu browser e load hoy (SSR/build e kono problem nai)
//  - boro phone photo ke age choto (max 1600px) kore, tai fast ar kom memory
//  - screen e status dekhay (model download %, processing, error)
//  - fail korle error throw kore (card er catch fallback e original photo dey)

type BgOptions = {
  model?: "isnet" | "isnet_fp16" | "isnet_quint8";
  output?: { format?: "image/png" | "image/jpeg" | "image/webp"; quality?: number };
};

const MAX_DIM = 1600;
const TOAST_ID = "cw-bg-toast";
let hideTimer: ReturnType<typeof setTimeout> | undefined;

function hideToast() {
  if (typeof document === "undefined") return;
  document.getElementById(TOAST_ID)?.remove();
}

function showToast(text: string, kind: "info" | "error" = "info", autoHideMs = 0) {
  if (typeof document === "undefined") return;
  let el = document.getElementById(TOAST_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = TOAST_ID;
    Object.assign(el.style, {
      position: "fixed",
      left: "50%",
      bottom: "90px",
      transform: "translateX(-50%)",
      zIndex: "9999",
      maxWidth: "90vw",
      padding: "10px 16px",
      borderRadius: "12px",
      font: "700 12px system-ui, sans-serif",
      boxShadow: "0 8px 30px rgba(0,0,0,.5)",
      pointerEvents: "none",
      textAlign: "center",
    } as Partial<CSSStyleDeclaration>);
    document.body.appendChild(el);
  }
  el.style.background = kind === "error" ? "#7f1d1d" : "#121624";
  el.style.border = kind === "error" ? "1px solid #ef4444" : "1px solid #D4AF37";
  el.style.color = kind === "error" ? "#fecaca" : "#D4AF37";
  el.textContent = text;
  if (hideTimer) clearTimeout(hideTimer);
  if (autoHideMs > 0) hideTimer = setTimeout(hideToast, autoHideMs);
}

async function downscale(file: Blob): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const ratio = Math.min(1, MAX_DIM / Math.max(bmp.width, bmp.height));
    if (ratio >= 1) {
      bmp.close();
      return file;
    }
    const w = Math.round(bmp.width * ratio);
    const h = Math.round(bmp.height * ratio);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bmp.close();
      return file;
    }
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();
    return await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b ?? file), "image/png")
    );
  } catch {
    return file;
  }
}

export async function removeBackground(file: Blob, options: BgOptions = {}): Promise<Blob> {
  if (typeof window === "undefined") {
    throw new Error("removeBackground shudhu browser e cholbe");
  }

  try {
    showToast("🤖 AI background remover load hocche...");
    const { removeBackground: run } = await import("@imgly/background-removal");
    const input = await downscale(file);

    const result = await run(input, {
      model: options.model ?? "isnet_fp16",
      output: {
        format: options.output?.format ?? "image/png",
        quality: options.output?.quality ?? 0.8,
      },
      progress: (key, current, total) => {
        if (key.startsWith("fetch") && total > 0) {
          showToast(
            `⬇️ AI model download hocche... ${Math.round((current / total) * 100)}% (prothom bar-i lage, pore fast)`
          );
        } else if (key.startsWith("compute")) {
          showToast("✂️ Background remove hocche...");
        }
      },
    });

    showToast("✅ Background remove hoyeche", "info", 1500);
    return result;
  } catch (err) {
    console.error("[bgRemoval] failed:", err);
    const reason = err instanceof Error ? err.message : String(err);
    showToast(
      `⚠️ Auto background remove hoyni (${reason}). Original photo use kora hocche.`,
      "error",
      9000
    );
    throw err;
  }
}
