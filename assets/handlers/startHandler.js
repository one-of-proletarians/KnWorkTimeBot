export default function useStart(User) {
  return (ctx) => {
    const {
      id: _id,
      first_name: name,
      username: telegram_id,
    } = ctx.message.from;

    User.findById(_id).then((res) => {
      if (!res)
        new User({ _id, name, telegram_id })
          .save()
          .then(() => ctx.reply("Добро пожаловать " + name));
      else ctx.reply("С возвращением");
    });
  };
}
