const time = (start, end) => (end < start ? 24 - start + end : end - start);

const wordFormat = (num, word) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return word[
    num % 100 > 4 && num % 100 < 20 ? 2 : cases[num % 10 < 5 ? num % 10 : 5]
  ];
};

const daysPerMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const timeInterval = (raw) =>
  raw
    .replace(/\s|\-/g, "*")
    .split("*")
    .map((e) => +e);

const createDate = (raw) => {
  const date = new Date();
  if (!raw.day) return date.toLocaleDateString("ru");
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    raw.day
  ).toLocaleDateString("ru");
};

export { time };
export { wordFormat };
export { daysPerMonth };
export { timeInterval };
export { createDate };
export default {
  time,
  wordFormat,
  daysPerMonth,
  timeInterval,
  createDate,
};
