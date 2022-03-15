import { Telegraf, Scenes, session } from "telegraf";
// import { config } from "dotenv";

import useHelp from "./assets/commands/helpCommand.js";
import useStart from "./assets/handlers/startHandler.js";
import useDeleteAll from "./assets/handlers/deleteAll.js";
import useInfoCommand from "./assets/commands/infoCommand.js";
import { removeRecordScene } from "./Scenes/removeRecordScene.js";

import {
  timeRegExp,
  deleteAllRegExp,
  deleteRecordRegExp,
  dateAndTimeRegExp,
} from "./assets/regexp.js";

import { isDev } from "./assets/helpers.js";
import useAddRecord from "./assets/handlers/addRecord.js";
import useTimeParser from "./middlewares/useTimeParser.js";
import useOnlyTime from "./middlewares/useOnlyTime.js";
import useInitialState from "./middlewares/useInitialState.js";
import useSetToday from "./middlewares/useSetToday.js";
import useMonthsList from "./assets/handlers/useMonthsList.js";

// config();

const telegramToken = isDev()
  ? process.env.DEV_BOT_TOKEN
  : process.env.BOT_TOKEN;

const bot = new Telegraf(telegramToken);

bot.use(session());
bot.use(new Scenes.Stage([removeRecordScene]));
bot.use(useInitialState());
bot.use(useSetToday());
bot.use(useOnlyTime());
bot.use(useTimeParser());

bot.hears(deleteRecordRegExp, Scenes.Stage.enter("removeRecord"));

bot.start(useStart());
bot.help(useHelp());
bot.command(["monthstatistic", "s"], useInfoCommand());
bot.command(["deletetoday", "d"], Scenes.Stage.enter("removeRecord"));

bot.hears([dateAndTimeRegExp, timeRegExp], useAddRecord());
bot.hears(deleteAllRegExp, useDeleteAll());
bot.hears("list", useMonthsList());

bot.hears(/./, removeAllMessages);
bot.on("sticker", removeAllMessages);
bot.on("document", removeAllMessages);
bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

function removeAllMessages(ctx) {
  ctx.deleteMessage();
}
