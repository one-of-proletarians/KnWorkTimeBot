import { Telegraf, Scenes, session } from "telegraf";
import "./settings.js";

import useHelp from "./assets/commands/helpCommand.js";
import useStart from "./assets/handlers/startHandler.js";
import useDeleteAll from "./assets/handlers/deleteAll.js";
import useInfoCommand from "./assets/commands/infoCommand.js";
import { removeRecordScene } from "./Scenes/removeRecordScene.js";
import { selectScene } from "./Scenes/selectScene.js";

import {
  timeRegExp,
  deleteAllRegExp,
  deleteRecordRegExp,
  dateAndTimeRegExp,
} from "./assets/regexp.js";

import { isDev, removeAllMessages } from "./assets/helpers.js";
import useAddRecord from "./assets/handlers/addRecord.js";
import useState from "./middlewares/useState.js";
import useToday from "./middlewares/useToday.js";

const telegramToken = isDev()
  ? process.env.DEV_BOT_TOKEN
  : process.env.BOT_TOKEN;

const bot = new Telegraf(telegramToken);

bot.use(session());
bot.use(new Scenes.Stage([removeRecordScene, selectScene]));
bot.use(useState());
bot.use(useToday());

bot.start(useStart());
bot.help(useHelp());
bot.command(["monthstatistic", "s"], useInfoCommand());
bot.command(["deletetoday", "d"], Scenes.Stage.enter("removeRecord"));

bot.hears(deleteAllRegExp, useDeleteAll());
bot.hears([dateAndTimeRegExp, timeRegExp], useAddRecord());
bot.hears(deleteRecordRegExp, Scenes.Stage.enter("removeRecord"));
bot.hears("a", Scenes.Stage.enter("selectScene"));

bot.hears(/./, removeAllMessages);
bot.on("sticker", removeAllMessages);
bot.on("document", removeAllMessages);
bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
