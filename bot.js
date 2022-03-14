import { Telegraf, Scenes, session } from "telegraf";
import { config } from "dotenv";

import useHelp from "./assets/commands/helpCommand.js";
import useStart from "./assets/handlers/startHandler.js";
import useDeleteAll from "./assets/handlers/deleteAll.js";
import useInfoCommand from "./assets/commands/infoCommand.js";
import { saveOrUpdate } from "./assets/handlers/saveOrUpdate.js";
import { removeRecordScene } from "./Scenes/removeRecordScene.js";

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

config();

const telegramToken = isDev()
  ? process.env.DEV_BOT_TOKEN
  : process.env.BOT_TOKEN;

const bot = new Telegraf(telegramToken);

bot.use(session());
bot.use(new Scenes.Stage([removeRecordScene]));

bot.hears(deleteRecordRegExp, Scenes.Stage.enter("removeRecord"));

bot.start(useStart());
bot.help(useHelp());
bot.command(["monthstatistic", "s"], useInfoCommand());
bot.command(["deletetoday", "d"], Scenes.Stage.enter("removeRecord"));

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

bot.hears(/./, removeAllMessages);
bot.on("sticker", removeAllMessages);
bot.on("document", removeAllMessages);
bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

function removeAllMessages(ctx) {
  ctx.deleteMessage();
}
