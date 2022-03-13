import Table from "easy-table";
import months from "../months.js";

function getWeekDay(date) {
  const [day, month, year] = date.split(".").map((e) => +e);
  const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  return days[new Date(year, month - 1, day).getDay()];
}

export default function useInfoCommand(User) {
  return async (ctx) => {
    const date = new Date().toLocaleDateString("ru", {
      month: "2-digit",
      year: "numeric",
    });

    const _id = ctx.message.from.id;
    const reg = new RegExp(`\\d{2}\\.${date}`);

    const user = await User.findOne({
      _id,
      records: {
        $elemMatch: {
          date: {
            $regex: new RegExp(`\\d{2}\\.${date}`),
          },
        },
      },
    });

    if (user) {
      const [month, year] = date.split(".").map((e) => +e);
      const t = new Table();

      user.records.forEach((e) => {
        if (!reg.test(e.date)) return;
        const { start, end } = e.value;

        const period = `${start}:00 - ${end}:00`.replace("7", " 7");

        t.cell("День", getWeekDay(e.date));
        t.cell("Дата", +e.date.substring(0, 2));
        t.cell("Смена", period);
        t.cell("Часы", e.value.amount, Table.number());
        t.newRow();
      });

      t.sort(["Дата|asc"]);
      t.total("Дата", {
        printer: (val) => Table.padLeft(val, 0),
        reduce: (acc) => acc + 1,
      });
      t.total("Часы");

      await ctx.replyWithHTML(`<b><i>${year} ${months[month - 1]}</i></b>`);
      ctx.replyWithHTML(`<pre>${t}</pre>`);
    } else ctx.reply("За текущий месяц записи отсутствуют.");
  };
}
