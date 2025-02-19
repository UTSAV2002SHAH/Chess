import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Schema
const moveSchema = new Schema({
  gameId: { type: Schema.Types.ObjectId, ref: "Game", required: true, unique: true },
  moves: [
    {
      moveNumber: { type: Number, required: true },
      from: { type: String, required: true },
      to: { type: String, required: true },
      before: { type: String, required: true },
      after: { type: String, required: true },
      san: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Define and Export the Model
const MoveModel = mongoose.model("Move", moveSchema);

export default MoveModel;