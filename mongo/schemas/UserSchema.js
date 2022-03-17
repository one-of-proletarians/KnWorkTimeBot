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

UserScheme.statics.getRecords = async function (id) {
  const user = await this.findById(id);
  return user.records;
};
