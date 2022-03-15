import { User } from "../../mongo/mongo.js";
import { printTable } from "../printTable.js";

export default function useInfoCommand() {
  return async (ctx) => {
    const date = new Date().toLocaleDateString("ru", {
      month: "2-digit",
      year: "numeric",
    });

    const _id = ctx.message.from.id;

    const user = await User.findOne({
      _id,
      records: {
        $elemMatch: { date: { $regex: new RegExp(`\\d{2}\\.${date}`) } },
      },
    });

    if (user) printTable(ctx, date, user.records);
    else ctx.reply("За текущий месяц записи отсутствуют.");
  };
}
