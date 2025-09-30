
import mongoose from "mongoose";
import { title } from "process";
import { trim } from "zod";

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    complete:{
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{
    timestamps: true
})

export const Todo = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);

