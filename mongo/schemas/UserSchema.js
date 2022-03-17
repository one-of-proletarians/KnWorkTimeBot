import mongoose from 'mongoose';

export const UserScheme = new mongoose.Schema({
  _id: Number,
  name: String,
  telegram_id: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  records: [
    {
      date: String,
      value: {
        start: Number,
        end: Number,
        amount: Number,
      },
    },
  ],
});

/**
 *
 * @param {UserScheme._id} id
 * @returns {Promise<[{date: String | StringConstructor, value: {amount: Number | NumberConstructor, start: Number | NumberConstructor, end: Number | NumberConstructor}}]|[]|*>}
 */
UserScheme.statics.getRecords = async function (id) {
  const user = await this.findById(id);
  return user.records;
};

/**
 *
 * @param {[UserRecord]}records
 * @param {RegExp}regex
 */
UserScheme.statics.recordsByRegex = (records, regex) =>
  records.filter(record => regex.test(record.date));
