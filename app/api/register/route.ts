import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { id, name, email, password, avatar, konamiId, hardware, location, facebook, whatsapp } = data;

    // Check if user already exists
    const [existing]: any = await db.query("SELECT id FROM players WHERE email = ?", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ status: "exists", message: "Email already registered" });
    }

    // Insert new player
    await db.query(
      `INSERT INTO players (id, name, email, password, avatar, konami_id, hardware, location, facebook, whatsapp) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        email,
        password,
        avatar || "",
        konamiId || "Not Set",
        hardware || "Not Set",
        location || "Not Set",
        facebook || "",
        whatsapp || "",
      ]
    );

    return NextResponse.json({ status: "success", message: "Registered successfully" });
  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}