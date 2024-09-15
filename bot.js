import { config } from "npm:dotenv";

import { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } from "npm:grammy";
import { Menu } from "npm:@grammyjs/menu";

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
      .url("The Phantom of the Opera", "https://t.me/c/2096048963/14")
      .url("Frankenstein", "https://t.me/c/2096048963/81")
      .url("Sherlock Holmes: The Emerald Crown", "https://t.me/c/2096048963/127");

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

// is about to be terminated
// process.once("SIGINT", () => bot.stop());
// process.once("SIGTERM", () => bot.stop()); // Stopping the bot when the Node.js process



export default bot;
