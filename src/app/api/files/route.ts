import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";

export async function GET() {
  const dir = path.join(process.cwd(), "public", "pdf");
  let files: string[] = [];

  try {
    files = fs
      .readdirSync(dir)
      .filter((name) => name.toLowerCase().endsWith(".pdf"))
      .sort();
  } catch {}

  return NextResponse.json({ files });
}
