import { saveOrUpdate } from "./saveOrUpdate.js";

export default function useAddRecord() {
  return (ctx) => {
    const { date, period } = ctx.session.state;
    if (date.error) return ctx.reply("Не корректная дата");
    saveOrUpdate(ctx, period, date.input);
  };
}
