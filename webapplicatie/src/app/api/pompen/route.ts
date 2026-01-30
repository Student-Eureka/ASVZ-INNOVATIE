// src/app/api/pompen/route.ts
import { NextResponse } from "next/server";

// Mock data, vervang dit met je database call
const pompenData = [
  { id: "1", woning: "woning_1", status: "actief" },
  { id: "2", woning: "woning_2", status: "rust" },
  { id: "3", woning: "woning_3", status: "inactief" },
];

export async function GET() {
  // Altijd een array teruggeven, zelfs als geen data
  return NextResponse.json(pompenData || []);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Nieuwe status ontvangen:", body);

    // Hier zou je de status naar je database schrijven
    // await updatePompStatus(body.pomp_id, body.woning, body.status);

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
