import 'dotenv/config';
import { Markup } from 'telegraf';

/**
 *
 * @param {Number} start начало смены
 * @param {Number} end конец смены
 * @returns Количество часов от start до end
 */
export const time = (start, end) =>
  end < start ? 24 - start + end : end - start;

/**Сегодняшняя дата */
export const today = () => new Date().toLocaleDateString('ru');

/**Склонение слов */
export const wordFormat = (num, word) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return word[
    num % 100 > 4 && num % 100 < 20 ? 2 : cases[num % 10 < 5 ? num % 10 : 5]
  ];
};

/** Почти то же самое что strToArr */
export const timeInterval = raw =>
  raw
    .replace(/\s|-/g, '*')
    .split('*')
    .map(e => +e);

/**
 *
 * @param {String} str Исходная строка
 * @param {String} separator Сепаратор
 * @param {Boolean} toNumber Приводить к числу или нет
 * @returns number[]|string[]
 */
export const strToArr = (str, separator = '.', toNumber = true) => {
  const result = str.trim().replace(/,|-|_/g, '.').split(separator);
  return toNumber ? result.map(e => +e) : result;
};

/**
 * Последний день месяца
 * @param month
 * @returns {number}
 */
export const daysPerMonth = month => {
  const date = new Date();
  return new Date(
    date.getFullYear(),
    +month ?? date.getMonth() + 1,
    0
  ).getDate();
};
/** Проверяет запущен ли проект в режиме разработки */
export const isDev = () => process.env.NODE_ENV === 'development';

/**!! Это надо отрефакторить */
export const createDate = raw => {
  const date = new Date();

  if (!raw.day) return date.toLocaleDateString('ru');

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    raw.day
  ).toLocaleDateString('ru');
};

/**
 * @param rawData dd.mm.yyyy
 * @returns {null|string}
 */
export const stringToDate = rawData => {
  const [_, cMonth, cYear] = strToArr(new Date().toLocaleDateString('ru'));
  const [day, m] = strToArr(rawData);
  const month = m ?? cMonth;
  const days = daysPerMonth(month);

  return day < 1 || day > days || month < 1 || month > 12
    ? null
    : new Date(cYear, month - 1, day).toLocaleDateString('ru');
};

/**
 * @param raw
 * @returns {string|null}
 */
export const deleteTodayParse = raw => {
  return raw === '/dt' || raw === '/deletetoday' ? today() : null;
};

/**
 * @param {String} date 01.01.2022
 */
export const isToday = date => date === today();

/**
 * @param {Context} ctx
 */
export const removeAllMessages = ctx => ctx.deleteMessage();

/**
 * @param {Array<string|number>} buttonText
 * @param {number}cols
 * @returns {Markup<ReplyKeyboardMarkup>}
 */
export const makeKeyboard = (buttonText, cols = 3) => {
  const len = buttonText.length;
  cols = cols <= len ? cols : len;

  let count = 0;
  let buttons = [];
  let col = [];

  for (const text of buttonText) {
    buttons.push(Markup.button.text(text));

    if (++count === cols) {
      col.push(buttons);
      buttons = [];
      count = 0;
    }
  }

  if (buttons.length) col.push(buttons);

  return Markup.keyboard(col).resize();
};
