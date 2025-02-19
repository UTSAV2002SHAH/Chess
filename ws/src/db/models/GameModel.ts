import mongoose, { Schema, Model } from "mongoose";

const gameSchema = new Schema({
  players: {
    white: { type: Schema.Types.ObjectId, ref: "User", required: true },
    black: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  moves: [{ type: Schema.Types.ObjectId, ref: "Move" }], // Move structure
  status: { type: String, enum: ["IN_PROGRESS", "COMPLETED", "DRAW"], default: "IN_PROGRESS" },
  result: { type: String, default: "ongoing" },
  createdAt: { type: Date, default: Date.now },
});

// Create the model without an explicit TypeScript interface
const GameModel: Model<any> = mongoose.model("Game", gameSchema);

export default GameModel;