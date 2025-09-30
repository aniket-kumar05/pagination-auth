import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    await connectDB(); 

    const body = await req.json();
    const { name, email, password } = body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    const user = await User.create({ name, email, password });

    return NextResponse.json(
      { message: "User registered successfully", user:{
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image
      } },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
