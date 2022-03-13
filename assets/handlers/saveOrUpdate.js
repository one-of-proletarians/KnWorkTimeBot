import { time, wordFormat } from "../helpers.js";
import { User } from "../../mongo/mongo.js";

export const saveOrUpdate = async (ctx, period, date) => {
  date = date ?? new Date().toLocaleDateString("ru");

  const id = ctx.message.from.id;
  const declensionTime = ["часов", "часа", "часов"];

  let statusMsg = "<b>Добавлено</b>";

  const [start, end] = period;

  let amount = time(start, end);

  if (amount < 4) return ctx.replyWithHTML("<b>Ошибка.</b>\nМинимум 4 часа");

  const user = await User.findById(id);
  const index = user.records.findIndex((elem) => elem.date === date);

  const value = {
    start,
    end,
    amount,
  };

  if (index === -1)
    user.records.push({
      date,
      value,
    });
  else {
    user.records[index].value = value;
    statusMsg = "<b>Обновлено</b>";
  }

  await user.save();

  await ctx.replyWithHTML(statusMsg);
  ctx.replyWithHTML(
    `<b><i>Дата: ${date}</i></b>
		${start}:00 - ${end}:00
		<b>${amount}</b> ${wordFormat(amount, declensionTime)}`.replace(/\t/g, "")
  );
};
