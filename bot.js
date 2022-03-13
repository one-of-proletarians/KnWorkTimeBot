import { Telegraf } from "telegraf";
import { config } from "dotenv";
import { User } from "./mongo/mongo.js";

import useHelp from "./assets/commands/helpCommand.js";
import useStart from "./assets/handlers/startHandler.js";
import useInfoCommand from "./assets/commands/infoCommand.js";
import useDeleteToday from "./assets/commands/deleteToday.js";
import useDeleteTodayAction from "./assets/actions/deleteTodayAction.js";
import { saveOrUpdate } from "./assets/handlers/saveOrUpdate.js";

import {
  timeRegExp,
  dayAndTimeRegExp,
  deleteAllRegExp,
  deleteRecordRegExp,
} from "./assets/regexp.js";

import {
  isDev,
  createDate,
  daysPerMonth,
  timeInterval,
} from "./assets/helpers.js";
import useDeleteAll from "./assets/handlers/deleteAll.js";

config();

const telegramToken = isDev()
  ? process.env.DEV_BOT_TOKEN
  : process.env.BOT_TOKEN;

const bot = new Telegraf(telegramToken);

bot.start(useStart());
bot.help(useHelp());
bot.command("monthstatistic", useInfoCommand());
bot.command("deletetoday", useDeleteToday());
bot.hears(deleteRecordRegExp, useDeleteToday());
bot.action([/del-t-d\|\d{1,2}/, "del-t-c"], useDeleteTodayAction());

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

bot.hears(deleteAllRegExp, useDeleteAll());
bot.hears(new RegExp(`^${timeRegExp}$`), (ctx) => {
  saveOrUpdate(ctx, timeInterval(ctx.match.input));
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
