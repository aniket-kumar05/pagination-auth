import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function POST(req: NextRequest) {
  try {
    console.log("Login request received");
    await connectDB();
    console.log("DB connected");

    const body = await req.json();
    console.log("Body:", body);

    const { email, password } = body;

    const user = await User.findOne({ email });
    // console.log("User found:", user);

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return NextResponse.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, image: user.image },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}

