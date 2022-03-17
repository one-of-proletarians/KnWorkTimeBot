import Table from 'easy-table';
import months from './months.js';

/**
 * @param {Context} ctx
 * @param {Array<UserScheme>} records
 * @returns {Promise<Message.TextMessage|ReturnType<Telegram[string]>>}
 */

export const printTable = async (ctx, records) => {
  const t = new Table();

  for (const record of records) {
    const { start, end } = record.value;

    const period = `${start}:00 - ${end}:00`.replace('7', ' 7');

    t.cell('День', getWeekDay(record.date));
    t.cell('Дата', +record.date.substring(0, 2));
    t.cell('Смена', period);
    t.cell('Часы', record.value.amount, Table.number());
    t.newRow();
  }

  t.sort(['Дата|asc']);
  t.total('Дата', {
    printer: val => Table.padLeft(val, 0),
    reduce: acc => acc + 1,
  });
  t.total('Часы');

  return await ctx.replyWithHTML(`<pre>${t}</pre>`);
};

/**
 *
 * @param {Date} date
 * @returns День недели по имени соответствующий дате
 */
function getWeekDay(date) {
  const [day, month, year] = date.split('.').map(e => +e);
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return days[new Date(year, month - 1, day).getDay()];
}
