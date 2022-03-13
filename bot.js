import { Telegraf } from "telegraf";

import useStart from "./assets/handlers/startHandler.js";

import { User } from "./mongo/mongo.js";
import useInfoCommand from "./assets/commands/infoCommand.js";
import useDeleteToday from "./assets/commands/deleteToday.js";

import useDeleteTodayAction from "./assets/actions/deleteTodayAction.js";

import { timeRegExp, dayAndTimeRegExp } from "./assets/regexp.js";
import useHelp from "./assets/commands/helpCommand.js";
import { saveOrUpdate } from "./assets/handlers/saveOrUpdate.js";

import {
  createDate,
  daysPerMonth,
  isDev,
  timeInterval,
} from "./assets/helpers.js";

import { config } from "dotenv";

config();

const dev = isDev();
const telegramToken = dev ? process.env.DEV_BOT_TOKEN : process.env.BOT_TOKEN;

main();

async function main() {
  const bot = new Telegraf(telegramToken);

  bot.start(useStart());
  bot.help(useHelp());

  bot.command("monthstatistic", useInfoCommand());
  bot.command("deletetoday", useDeleteToday());

  bot.action([/del-t-d\|\d{1,2}/, "del-t-c"], useDeleteTodayAction());

  bot.hears(/del\s\d{1,2}/i, useDeleteToday());

  bot.hears(new RegExp(`^${dayAndTimeRegExp}$`), (ctx) => {
    const days = daysPerMonth();
    const input = ctx.match.input.replace(/\s/, "*");
    const [day, dateString] = input.split("*").map((e, i) => (!i ? +e : e));
    const period = timeInterval(dateString);

    if (day > days || day < 1)
      return ctx.replyWithHTML(
        `<b>Ошибка.</b>\nВведите день в формате 1 - ${days}`
      );

    const date = createDate({ day });
    saveOrUpdate(ctx, period, date);
  });

  bot.hears(new RegExp(`^${timeRegExp}$`), (ctx) => {
    saveOrUpdate(ctx, timeInterval(ctx.match.input));
  });

  bot.on("sticker", async (ctx) => {
    await ctx.reply("Стикеры не поддерживаются и будут удаляться");
    setTimeout(() => {
      ctx.deleteMessage(ctx.message.message_id);
      ctx.deleteMessage(ctx.message.message_id + 1);
    }, 3000);
  });

  bot.hears(/Удалить вс(е|ё)/i, async (ctx) => {
    const id = ctx.message.from.id;

    const user = await User.findById(id);
    if (!user.records.length) return ctx.reply("Записи отсутствуют.");
    user.records = [];
    const result = await user.save();
    if (!result.records.length) ctx.reply("Записи успешно удалены.");
  });

  bot.hears(/^.*/, async (ctx) => {
    await ctx.reply("Это будет удалено через 2 секунды");
    setTimeout(async () => {
      await ctx.deleteMessage(ctx.message.message_id + 1);
      ctx.deleteMessage(ctx.message.message_id);
    }, 2000);
  });

  bot.launch();

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
