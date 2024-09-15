import { config } from "npm:dotenv";

import { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard, webhookCallback } from "https://deno.land/x/grammy@v1.17.2/mod.ts";
import { Menu } from "npm:@grammyjs/menu";

import { serve } from "https://deno.land/std@0.182.0/http/server.ts";

config();
const bot = new Bot(Deno.env.get("API_TOKEN"));

bot.command("start", async (ctx) => {
  const keyboard = new Keyboard().text("Тест на рівень").text("Обрати книгу");
  await ctx.reply(
      "*Greetings everyone\\!*\n\nBook Book \\- це читацький клуб рівнів A2 \\- B1\\.\n\nТут на вас чекають книги у \\.pdf форматі\\, аудіо та завдання до тексту\\.\n\n[Клікай](https://t\\.me/+9PYtuOuUufFjNzA0) щоб доєднатися до чату [Book Book readers](https://t\\.me/+9PYtuOuUufFjNzA0)\\.",
      {
        parse_mode: "MarkdownV2",
      },
  );
  await ctx.reply("Чого душа бажає?", {
    reply_markup: keyboard,
  });
});

bot.hears("Тест на рівень", async (ctx) => {
  const inlineKeyboard = new InlineKeyboard().url(
      "Тест тутоньки",
      "https://www.cambridgeenglish.org/test-your-english/general-english",
  );
  await ctx.reply("3 хвилини і ти дізнаєшся свій рівень.\nGood luck!", {
    reply_markup: inlineKeyboard,
  });
});

bot.hears("Обрати книгу", async (ctx) => {
  const booksKeyboard = new InlineKeyboard()
      .url("The Phantom of the Opera", "https://drive.google.com/drive/folders/10QEDjcnpM49PVGBMaTFASWbGL9Pb5Oz1")
      .url("Frankenstein", "https://drive.google.com/drive/folders/1Of9vxXFIK0Ok-93i2ss6yVKCNQNaJM-b")
      .url("Sherlock Holmes: The Emerald Crown", "https://drive.google.com/drive/folders/17xlQ7jxyPp6K9gPgQhDgmXoERr0zu65L");

  await ctx.reply("Яку книгу будеш читати?", {
    reply_markup: booksKeyboard,
  });
});

const menu = new Menu("main-menu")
    .text("Тест на рівень")
    .text("Обрати книгу", (ctx) => ctx.reply("Обрати книгу"));

bot.use(menu);

bot.command("start", async (ctx) => {
  await ctx.reply("Check out this menu:", {
    reply_markup: menu,
  });
});

bot.catch((e) => {
  console.error(
      e,
      `Error while handling the update ${e.ctx.update.update_id}:`,
  );

  if (e.error instanceof GrammyError) {
    console.error("Error in request:", e.error.description);
    return;
  }

  if (e.error instanceof HttpError) {
    console.error("Could not reach Telegram:", e.error);
    return;
  }

  console.error("Unknown error:", e.error);
});

const handleUpdate = webhookCallback(bot, "std/http");

// Serve incoming requests on Deno Deploy
serve(async (req) => {
  if (req.method === "POST") {
    try {
      return await handleUpdate(req);
    } catch (err) {
      console.error("Error in bot:", err);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  return new Response("Hello from Deno Deploy!", { status: 200 });
});
