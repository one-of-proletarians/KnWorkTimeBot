import Table from 'easy-table';
import months from './months.js';

/**
 *
 * @param {Telegraf<Context>} ctx Контекст Телеграфа
 * @param {Date} date Дата в виде строки
 * @param {Array<UserRecord>} records Массив записей
 */

export const printTable = async (ctx, date, records) => {
  const [month, year] = date.split('.').map(e => +e);
  const reg = new RegExp(`\\d{2}\\.${date}`);
  const t = new Table();

  records.forEach(e => {
    if (!reg.test(e.date)) return;
    const { start, end } = e.value;

    const period = `${start}:00 - ${end}:00`.replace('7', ' 7');

    t.cell('День', getWeekDay(e.date));
    t.cell('Дата', +e.date.substring(0, 2));
    t.cell('Смена', period);
    t.cell('Часы', e.value.amount, Table.number());
    t.newRow();
  });

  t.sort(['Дата|asc']);
  t.total('Дата', {
    printer: val => Table.padLeft(val, 0),
    reduce: acc => acc + 1,
  });
  t.total('Часы');

  await ctx.replyWithHTML(`<b><i>${year} ${months[month - 1]}</i></b>`);
  ctx.replyWithHTML(`<pre>${t}</pre>`);
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
