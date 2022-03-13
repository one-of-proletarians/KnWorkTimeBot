export default function useUpdateAction() {
  return async (ctx) => {
    await ctx.answerCbQuery();
    const msg_id = ctx.update.callback_query.message.message_id;
    const action = ctx.update.callback_query.data;
    console.log(ctx.update.callback_query.data);

    await ctx.deleteMessage(msg_id);
    await ctx.deleteMessage(msg_id - 1);

    if (action === "update") ctx.reply("Обновлено");
    else ctx.reply("Отменено");
  };
}
