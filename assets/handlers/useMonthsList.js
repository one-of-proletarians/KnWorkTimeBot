import { User } from "../../mongo/mongo.js";
import months from "../months.js";

export default () => async (ctx) => {
  const id = ctx.message.from.id;
  const user = await User.findById(id);
  const uniqueMonths = new Array(
    ...new Set(
      user.records
        .map((record) => +record.date.substring(3, 6))
        .sort((a, b) => (a > b ? 1 : -1))
    )
  );

  const listNames = uniqueMonths.map((m) => months[m - 1]);

  console.log(listNames);
};
