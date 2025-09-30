import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";

interface User {
    name: string;
    email: string;
    password: string;
    image: string;

}

const UserSchema: Schema<User> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    }
      
},
{ timestamps: true })

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// export const User = mongoose.model('User', UserSchema);
export const User = mongoose.models.User || mongoose.model("User", UserSchema);