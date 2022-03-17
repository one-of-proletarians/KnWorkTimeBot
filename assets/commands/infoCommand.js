import { User } from '../../mongo/mongo.js';
import { printTable } from '../printTable.js';
import months from '../months.js';

export default function useInfoCommand() {
  return async ctx => {
    const date = new Date().toLocaleDateString('ru', {
      month: '2-digit',
      year: 'numeric',
    });

    const _id = ctx.message.from.id;

    const user = await User.findOne({
      _id,
      records: {
        $elemMatch: { date: { $regex: new RegExp(`\\d{2}\\.${date}`) } },
      },
    });

    const [month, year] = date.split('.');

    if (user) {
      const records = User.recordsByRegex(
        user.records,
        new RegExp(`\\d{2}\\.${date}`)
      );
      await ctx.replyWithHTML(`<b>${year} ${months[month - 1]}</b>`);
      await printTable(ctx, records);
    } else ctx.reply('За текущий месяц записи отсутствуют.');
  };
}
