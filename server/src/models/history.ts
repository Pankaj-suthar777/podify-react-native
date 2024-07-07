import { Model, model } from "mongoose";
import { ObjectId, Schema } from "mongoose";

export type historyType = { audio: ObjectId; progress: number; date: Date };

interface HistoryObject {
  owner: ObjectId;
  last: historyType;
  all: historyType[];
}

const historySchema = new Schema<HistoryObject>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    last: {
      audio: {
        type: Schema.Types.ObjectId,
        ref: "Audio",
        required: true,
      },
    },
    all: [
      {
        type: Schema.Types.ObjectId,
        ref: "Audio",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("History", historySchema) as Model<HistoryObject>;
