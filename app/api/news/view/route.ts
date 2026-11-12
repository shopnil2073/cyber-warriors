import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req: Request) {
  try {
    const { id, currentViews } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const newViews = (currentViews || 0) + 1;

    const { error } = await supabase
      .from("news_articles")
      .update({ views: newViews })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true, views: newViews });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}