import { Telegraf } from "telegraf";
import { config } from "dotenv";
import mongoose from "mongoose";
import UserSchema from "./models/User.js";

import useStart from "./assets/handlers/startHandler.js";

import useInfoCommand from "./assets/commands/infoCommand.js";
import useDeleteToday from "./assets/commands/deleteToday.js";

import useDeleteTodayAction from "./assets/actions/deleteTodayAction.js";

import { timeRegExp, dayAndTimeRegExp } from "./assets/regexp.js";
import useHelp from "./assets/commands/helpCommand.js";

import {
  createDate,
  daysPerMonth,
  time,
  timeInterval,
  wordFormat,
} from "./assets/helpers.js";

config();

const dev = process.env.NODE_ENV === "development";
const telegramToken = dev ? process.env.DEV_BOT_TOKEN : process.env.BOT_TOKEN;
const mongoConnect = dev ? process.env.DEV_MONGO : process.env.MONGO;

main();

async function main() {
  const mongo = mongoose.createConnection(mongoConnect);
  const User = mongo.model("User", UserSchema);
  const bot = new Telegraf(telegramToken);

  bot.start(useStart(User));
  bot.help(useHelp());

  bot.command("monthstatistic", useInfoCommand(User));
  bot.command("deletetoday", useDeleteToday(User));

  bot.action([/del-t-d\|\d{1,2}/, "del-t-c"], useDeleteTodayAction(User));

  bot.hears(/del\s\d{1,2}/i, useDeleteToday(User));

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
    save(ctx, User, period, date);
  });

  bot.hears(new RegExp(`^${timeRegExp}$`), (ctx) => {
    save(ctx, User, timeInterval(ctx.match.input));
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

async function save(ctx, User, period, date) {
  date = date ?? new Date().toLocaleDateString("ru");

  const id = ctx.message.from.id;
  const declensionTime = ["часов", "часа", "часов"];

  let statusMsg = "<b>Добавлено</b>";

  const [start, end] = period;

  let amount = time(start, end);

  if (amount < 4) return ctx.replyWithHTML("<b>Ошибка.</b>\nМинимум 4 часа");

  const user = await User.findById(id);
  const index = user.records.findIndex((elem) => elem.date === date);

  const value = {
    start,
    end,
    amount,
  };

  if (index === -1)
    user.records.push({
      date,
      value,
    });
  else {
    user.records[index].value = value;
    statusMsg = "<b>Обновлено</b>";
  }

  await user.save();

  await ctx.replyWithHTML(statusMsg);
  ctx.replyWithHTML(
    `<b><i>Дата: ${date}</i></b>
		${start}:00 - ${end}:00
		<b>${amount}</b> ${wordFormat(amount, declensionTime)}`.replace(/\t/g, "")
  );
}
