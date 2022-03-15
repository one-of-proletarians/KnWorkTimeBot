import { stringToDate, strToArr } from "../assets/helpers.js";

export default () => (ctx, next) => {
  if (!ctx.message) return next();
  const { onlyTime } = ctx.session.state;

  let text = ctx.message.text.replace(/\s+/g, " ");
  let rawDate = "-";

  if (!/\d/.test(text[0])) return next();

  if (!onlyTime) [rawDate, text] = text.replace(/\s/, "*").split("*");
  const date = stringToDate(rawDate);
  ctx.session.state.date = {
    input: date,
    error: null === date && "-" !== rawDate,
  };
  ctx.session.state.period = strToArr(text.replace(" ", "-"));

  return next();
};
