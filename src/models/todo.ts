
import mongoose from "mongoose";

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

