import { NextRequest, NextResponse } from "next/server";

async function sendTelegramMessage(text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error(
      "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variables"
    );
  }

  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    }
  );

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.description || "Telegram API error");
  }

  return data;
}

export async function GET(request: NextRequest) {
  const message =
    request.nextUrl.searchParams.get("message") ?? "Hello from Next.js!";

  try {
    await sendTelegramMessage(message);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const message = body.message ?? "Hello from Next.js!";

  try {
    await sendTelegramMessage(message);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
