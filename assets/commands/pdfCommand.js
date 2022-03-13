import months from "../months.js";

const createButtons = () => {
  const keyboard = [];

  for (const [index, name] of months.entries()) {
    if (index % 3 === 0) {
      const row = [];
    }
  }
};
// createButtons();

export default function usePdfCommand() {
  return (ctx) => {
    ctx.reply("Выберите месяц:", {
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
