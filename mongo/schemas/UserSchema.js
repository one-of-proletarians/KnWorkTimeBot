import mongoose from "mongoose";

export default mongoose.Schema({
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
