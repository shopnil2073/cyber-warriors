import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { 
      id, 
      name, 
      email, 
      password, 
      avatar, 
      konamiId, 
      hardware, 
      location, 
      facebook, 
      whatsapp 
    } = data;

    // 1. Basic Validation
    if (!email || !password) {
      return NextResponse.json(
        { status: "error", message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2. Check if user already exists in database
    const [existing]: any = await db.query("SELECT id FROM players WHERE email = ?", [email]);
    if (existing && existing.length > 0) {
      return NextResponse.json({ status: "exists", message: "Email already registered" });
    }

    // 3. Fallback ID generate (jodi frontend theke ID na ashe)
    const userId = id || `CW-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Insert new player into MySQL cPanel DB
    await db.query(
      `INSERT INTO players (id, name, email, password, avatar, konami_id, hardware, location, facebook, whatsapp) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name || "Unknown Player",
        email,
        password,
        avatar || "/logo.jpg",
        konamiId || "Not Set",
        hardware || "Not Set",
        location || "Not Set",
        facebook || "",
        whatsapp || "",
      ]
    );

    return NextResponse.json({ status: "success", message: "Registered successfully" });
  } catch (error: any) {
    console.error("Database Connection Error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}