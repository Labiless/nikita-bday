import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface TelegramChat {
  id: number;
  type: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  title?: string;
}

interface ChatSummary {
  id: number;
  type: string;
  name: string;
  lastMessage: string;
  date: number;
}

export async function GET() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    return NextResponse.json(
      { success: false, error: "Missing TELEGRAM_BOT_TOKEN environment variable" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/getUpdates`,
      { cache: "no-store" }
    );
    const data = await res.json();

    if (!res.ok || !data.ok) {
      throw new Error(data.description || "Telegram API error");
    }

    const chatsById = new Map<number, ChatSummary>();

    for (const update of data.result ?? []) {
      const message = update.message ?? update.edited_message;
      const chat: TelegramChat | undefined = message?.chat;
      if (!chat) continue;

      const name =
        [chat.first_name, chat.last_name].filter(Boolean).join(" ") ||
        chat.username ||
        chat.title ||
        String(chat.id);

      chatsById.set(chat.id, {
        id: chat.id,
        type: chat.type,
        name,
        lastMessage: message.text ?? "",
        date: message.date ?? 0,
      });
    }

    const chats = Array.from(chatsById.values()).sort((a, b) => b.date - a.date);
    return NextResponse.json({ success: true, chats });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
