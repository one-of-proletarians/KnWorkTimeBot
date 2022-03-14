import { Scenes, Markup } from "telegraf";
import { deleteTodayParse, isToday, stringToDate } from "../assets/helpers.js";
import { User } from "../mongo/mongo.js";

/**Сцена для удаления записей */
export const removeRecordScene = new Scenes.WizardScene(
  "removeRecord",
  async (ctx) => {
    const text = ctx.message.text.trim();
    const input = text.replace(/del\s*/i, "");
    const _id = ctx.message.from.id;
    const date = deleteTodayParse(text) ?? stringToDate(input);
    const dateMessage = isToday(date) ? "Сегодня" : date;

    if (!date) {
      ctx.reply("Не корректная дата.");
      return ctx.scene.leave();
    }

    const user = await User.findOne({ _id, records: { $elemMatch: { date } } });

    if (!user) {
      ctx.replyWithHTML(`Запись за: <b>${dateMessage}</b> отсутствует.`);
      return ctx.scene.leave();
    }

    ctx.wizard.state.date = date;
    ctx.wizard.state.dateMessage = dateMessage;

    return ctx.replyWithHTML(
      `Удалить запись за: <b>${dateMessage}</b>`,
      Markup.inlineKeyboard([
        Markup.button.callback("Удалить", "delete"),
        Markup.button.callback("Отмена", "cancel"),
      ])
    );
  }
);

removeRecordScene.action("delete", async (ctx) => {
  const _id = ctx.from.id;
  const { date, dateMessage } = ctx.wizard.state;
  const { modifiedCount: result } = await User.updateOne(
    { _id, records: { $elemMatch: { date } } },
    { $pull: { records: { date } } }
  );

  await ctx.answerCbQuery();

  if (result) ctx.editMessageText(`Запись за ${dateMessage} удалена.`);
  return ctx.scene.leave();
});

removeRecordScene.action("cancel", (ctx) => {
  ctx.deleteMessage();
  return ctx.scene.leave();
});
