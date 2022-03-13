export default function useUpdateCommand() {
  return (ctx) => {
    ctx.reply("Обновить данные?", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Обновить", callback_data: "update" },
            { text: "Отмена", callback_data: "cancel" },
          ],
        ],
      },
    });
  };
}
