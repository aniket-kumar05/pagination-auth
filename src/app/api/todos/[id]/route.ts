// app/api/todos/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Todo } from "@/models/todo";
import jwt from "jsonwebtoken";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    
    const body = await request.json();
    
    const todo = await Todo.findOneAndUpdate(
      { _id: params.id, userId: decoded.id },
      body,
      { new: true }
    );

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ todo });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

export async function DELETE(request: Request,{ params }: { params: { id: string } }) {
  // context 
  // const params = context.params;
  //const id = params.id;
  try {
    await connectDB();
    
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    
    const todo = await Todo.findOneAndDelete({ 
      _id: params.id, 
      userId: decoded.id 
    });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}