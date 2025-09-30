
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Todo } from "@/models/todo";




export async function POST(request: Request) {
  try {
    await connectDB();

    // checking user is logged in

    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        {
          error: "No token found",
        },
        { status: 400 }
      );
    }
    //user Id
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    // get todo title from request body

    const body = await request.json();
    const { title } = body;

    // create new todo in database
    const todo = await Todo.create({
      title,
      userId: decoded.id,
    });
    return NextResponse.json({ todo }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}


export async function GET(request: Request) {
  try {
    await connectDB();
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    // Get user ID from token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    const todos = await Todo.find({ userId: decoded.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      // calculate total todos
    const total = await Todo.countDocuments({ userId: decoded.id });
    const totalPages = Math.ceil(total / limit);
    console.log("todos in backend",todos)
    return NextResponse.json({
      todos,
      pagination: {
        currentPage: page,
        totalPages,
        totalTodos: total,
        hasNext: page < totalPages, 
        hasPrev: page > 1, 
      },
    });
  } catch (error) {
    console.log("error in backend",error);
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}
