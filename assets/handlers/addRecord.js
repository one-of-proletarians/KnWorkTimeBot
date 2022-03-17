import { stringToDate, strToArr } from '../helpers.js';
import { saveOrUpdate } from './saveOrUpdate.js';

export default function useAddRecord() {
  return ctx => {
    const onlyTime =
      ctx.message.text?.replace(/\D/g, '-').split('-').length === 2;

    let text = ctx.message.text.replace(/\s+/g, ' ');
    let rawDate = '-';

    if (!onlyTime) [rawDate, text] = text.replace(/\s/, '*').split('*');
    const date = stringToDate(rawDate);
    const period = strToArr(text.replace(' ', '-'));

    if (!date && !onlyTime) return ctx.reply('Не корректная дата');
    saveOrUpdate(ctx, period, date);
  };
}
