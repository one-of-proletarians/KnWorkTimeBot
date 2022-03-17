export default () => (ctx, next) => {
  ctx.session.state.today = new Date().toLocaleDateString('ru');
  return next();
};
