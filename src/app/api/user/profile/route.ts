import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/models/user";
import { connectDB } from "@/lib/db";

export async function GET(request: Request) {
    try {
        await connectDB();
        const authHeader = request.headers.get('Authorization');

        if (!authHeader) {
            return NextResponse.json({
                message: "token is not found",
                status: 401,
                success: false
            })
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        console.log(decoded,"decoded");
        const user = await User.findById(decoded.id).select('-password');
        if(!user){
            return NextResponse.json({
                message: "User not found",
                status: 401,
                success: false
            })
        }
        return NextResponse.json({
            message: "User found",
            status: 200,
            success: true,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image
            }
        })
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json({
            message: "Invalid or expired token",
            status: 401,
            success: false
        });
    }
    
}