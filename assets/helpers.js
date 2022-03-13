import { config } from "dotenv";

config();

export const time = (start, end) =>
  end < start ? 24 - start + end : end - start;

export const wordFormat = (num, word) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return word[
    num % 100 > 4 && num % 100 < 20 ? 2 : cases[num % 10 < 5 ? num % 10 : 5]
  ];
};

export const daysPerMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const timeInterval = (raw) =>
  raw
    .replace(/\s|\-/g, "*")
    .split("*")
    .map((e) => +e);

export const createDate = (raw) => {
  const date = new Date();
  if (!raw.day) return date.toLocaleDateString("ru");
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    raw.day
  ).toLocaleDateString("ru");
};

export const isDev = () => process.env.NODE_ENV === "development";
