import mongoose, { Schema, Model } from "mongoose";

const gameSchema = new mongoose.Schema({
  players: {
    white: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
    black: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
  },
  moves: [{ type: Schema.Types.ObjectId, ref: "Move" }], // Move structure
  status: { type: String, enum: ["IN_PROGRESS", "COMPLETED", "DRAW"], default: "IN_PROGRESS" },
  result: { type: String, enum: ["WHITE_WINS", "BLACK_WINS", "DRAW", "ongoing"], default: "ongoing" },
  createdAt: { type: Date, default: Date.now },
});

// Create the model without an explicit TypeScript interface
const GameModel: Model<any> = mongoose.model("Game", gameSchema);

export default GameModel;