import { config } from "dotenv";

config();

/**
 *
 * @param {Number} start начало смены
 * @param {Number} end конец смены
 * @returns Количество часов от start до end
 */
export const time = (start, end) =>
  end < start ? 24 - start + end : end - start;

/**Сегодняшняя дата */
export const today = () => new Date().toLocaleDateString("ru");

/**Склонение слов */
export const wordFormat = (num, word) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return word[
    num % 100 > 4 && num % 100 < 20 ? 2 : cases[num % 10 < 5 ? num % 10 : 5]
  ];
};

/** Почти то же самое что strToArr */
export const timeInterval = (raw) =>
  raw
    .replace(/\s|\-/g, "*")
    .split("*")
    .map((e) => +e);

/**Разбивает строку по разделителю: , - _ . */
export const strToArr = (str) =>
  str
    .trim()
    .replace(/,|-|_/g, ".")
    .split(".")
    .map((e) => +e);

/**
 @param 1 - 12
 @returns Количество дней
 */
export const daysPerMonth = (month) => {
  const date = new Date();
  return new Date(
    date.getFullYear(),
    +month ?? date.getMonth() + 1,
    0
  ).getDate();
};
/** Проверяет запущен ли проект в режиме разработки */
export const isDev = () => process.env.NODE_ENV === "development";

/**!! Это надо отрефакторить */
export const createDate = (raw) => {
  const date = new Date();

  if (!raw.day) return date.toLocaleDateString("ru");

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    raw.day
  ).toLocaleDateString("ru");
};

/**@param Строка в виде '03.02.2022' */
export const stringToDate = (rawData) => {
  const [_, cMonth, cYear] = strToArr(new Date().toLocaleDateString("ru"));
  const [day, m] = strToArr(rawData);
  const month = m ?? cMonth;
  const days = daysPerMonth(month);

  return day < 1 || day > days || month < 1 || month > 12
    ? null
    : new Date(cYear, month - 1, day).toLocaleDateString("ru");
};

/**
 * @param Команда для удаления сегодняшней записи
 * @returns Текущая дата
 */
export const deleteTodayParse = (raw) => {
  return raw === "/d" || raw === "/deletetoday" ? today() : null;
};

/**
 * @param {String} date 01.01.2022
 */
export const isToday = (date) => date === today();
