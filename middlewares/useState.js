export default () => (ctx, next) => {
  ctx.session.state = {};
  return next();
};
