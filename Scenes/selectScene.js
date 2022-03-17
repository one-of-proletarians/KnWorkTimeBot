import { Markup, Scenes } from 'telegraf';
import { User } from '../mongo/mongo.js';
import { makeKeyboard } from '../assets/helpers.js';
import months from '../assets/months.js';
import { printTable } from '../assets/printTable.js';

const localState = {
  records: [],
  years: [],
  year: null,
};

/**
 * Сцена выбора даты путем создания клавиатуры, при выходе из сцены в session.state.select = {} записывается дата и массив записей
 * @type {WizardScene<Context & {scene: SceneContextScene<C, WizardSessionData>, wizard: WizardContextWizard<C>}>}
 */
export const selectScene = new Scenes.WizardScene(
  'selectScene',
  setState,
  selectYears,
  selectMonth
);

async function setState(ctx) {
  const { id } = ctx.message.from;
  const records = await User.getRecords(id);
  const _years = records.map(record => record.date.substring(6));
  const yKeyboard = [...new Set(_years.sort((a, b) => +a - +b))];

  localState.years = yKeyboard;
  localState.id = id;
  localState.records = records;

  if (!yKeyboard.length) {
    await ctx.reply('Записи отсутствуют.');
    return ctx.scene.leave();
  }

  const keyboard = makeKeyboard([...yKeyboard, 'Отмена']);
  await ctx.reply('Выберите год: 📆', keyboard);
  return ctx.wizard.next();
}

async function selectYears(ctx) {
  const message = ctx.message.text;
  const years = localState.years;
  const isSelect = years.includes(message);
  const cancel = message === 'Отмена';

  if (cancel) {
    await ctx.reply('Действие отменено. ❌', Markup.removeKeyboard());
    return ctx.scene.leave();
  }
  if (!isSelect) return ctx.reply('Выберите год из списка');

  const regex = new RegExp(message);
  const records = localState.records.filter(record => regex.test(record.date));
  const mKeyboard = new Set(
    records.map(record => months[+record.date.substring(3, 5) - 1])
  );

  localState.records = records;
  localState.year = message;

  const keyboard = makeKeyboard([...mKeyboard, 'Отмена']);
  await ctx.reply('Выберите месяц: 📆', keyboard);
  return ctx.wizard.next();
}

async function selectMonth(ctx) {
  const message = ctx.message.text;
  const month = months.indexOf(message) + 1;
  const cancel = message === 'Отмена';
  const year = localState.year;

  if (cancel) {
    await ctx.reply('Действие отменено. ❌', Markup.removeKeyboard());
    return ctx.scene.leave();
  }
  if (!month) return ctx.reply('Выберите месяц  из списка');

  const date = `${month}.${year}`;
  const regex = new RegExp(date);
  const records = localState.records.filter(record => regex.test(record.date));

  await ctx.replyWithHTML(
    `<b>${year} ${months[month - 1]}</b>`,
    Markup.removeKeyboard()
  );
  await printTable(ctx, records);

  return ctx.scene.leave();
}
