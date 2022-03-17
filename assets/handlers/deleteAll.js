import { User } from '../../mongo/mongo.js';
export default function useDeleteAll() {
  return async ctx => {
    const id = ctx.message.from.id;

    const user = await User.findById(id);
    if (!user.records.length) return ctx.reply('Записи отсутствуют.');
    user.records = [];
    const result = await user.save();
    if (!result.records.length) ctx.reply('Записи успешно удалены.');
  };
}
