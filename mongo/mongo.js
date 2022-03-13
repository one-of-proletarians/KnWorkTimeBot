import { mongoose } from "mongoose";
import UserShema from "./schemas/UserSchema.js";
import { isDev } from "../assets/helpers.js";

const dev = isDev();
const mongoConnect = process.env[dev ? "DEV_MONGO" : "MONGO"];

const db = mongoose.createConnection(mongoConnect);

export const User = db.model("User", UserShema);
