interface UserRecord {
  date: string;
  value: {
    start: number;
    end: number;
    amount: number;
  };
}

interface UserScheme {
  _id: number;
  name: string;
  telegram_id: string;
  records: [UserRecord];
  getRecords: (number) => [UserRecord];
  recordsByRegex: ([UserRecord], RegExp) => [UserRecord];
}
