import { createDate, daysPerMonth } from "../helpers.js";
import { User } from "../../mongo/mongo.js";

export default function useDeleteToday() {
  return async (ctx) => {
    const days = daysPerMonth();
    const _id = ctx.message.from.id;
    const [_, day] = ctx.message.text
      .replace(/\s{2,}/g, " ")
      .split(" ")
      .map((e, i) => (i ? +e : e));

    if ((day && day < 1) || day > days)
      return ctx.reply(`Введите день в формате: 1 - ${days}`);

    const date = createDate({ day });

    const user = await User.findOne({
      _id,
      records: { $elemMatch: { date } },
    });

    if (!user) return ctx.reply("Запись отсутствует.");

    ctx.reply(`Удалить запись за ${!day ? "сегодня" : date}?`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Удалить", callback_data: `del-t-d|${day ?? 0}` },
            { text: "Отмена", callback_data: "del-t-c" },
          ],
        ],
      },
    });
  };
}
