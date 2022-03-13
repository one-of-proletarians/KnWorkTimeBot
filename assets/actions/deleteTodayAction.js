import { createDate } from "../helpers.js";
import { User } from "../../mongo/mongo.js";

export default function useDeleteTodayAction() {
  return async (ctx) => {
    await ctx.answerCbQuery();
    const msg_id = ctx.update.callback_query.message.message_id;
    const _id = ctx.update.callback_query.message.chat.id;
    const [action, day] = ctx.update.callback_query.data
      .split("|")
      .map((e, i) => (i ? +e : e));
    console.log(action);
    if (action === "del-t-d") {
      const date = createDate({ day });

      console.log(date);
      const res = await User.updateOne(
        {
          _id,
          records: { $elemMatch: { date } },
        },
        { $pull: { records: { date } } }
      );

      if (res.modifiedCount)
        await ctx.replyWithHTML(`<i>${date}</i>\nУдалено!`);
    }

    ctx.deleteMessage(msg_id - 1);
    ctx.deleteMessage(msg_id);
  };
}
