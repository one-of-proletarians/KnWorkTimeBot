export default () => (ctx, next) => {
  const onlyTime = ctx.message.text.replace(/\D/g, "-").split("-").length === 2;
  ctx.session.state.onlyTime = onlyTime;
  next();
};
