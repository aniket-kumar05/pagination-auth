// // // app/api/user/update/route.ts
// // import { NextResponse } from "next/server";
// // import jwt from "jsonwebtoken";
// // import { User } from "@/models/user";
// // import { connectDB } from "@/lib/db";

// // export async function PUT(request: Request) {
// //   try {
// //     await connectDB();
// //     const authHeader = request.headers.get('Authorization');

// //     if (!authHeader) {
// //       return NextResponse.json({ error: "No token" }, { status: 401 });
// //     }

// //     const token = authHeader.split(' ')[1];
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
// //     const body = await request.json();

// //     const user = await User.findByIdAndUpdate(
// //       decoded.id,
// //       { 
// //         name: body.name,
// //         image: body.image
// //       },
// //       { new: true }
// //     ).select('-password');

// //     return NextResponse.json({ 
// //       message: "Profile updated successfully", 
// //       user: {
// //         id: user._id,
// //         name: user.name,
// //         email: user.email,
// //         image: user.image
// //       }
// //     });
// //   } catch (error) {
// //     return NextResponse.json({ error: "Update failed" }, { status: 400 });
// //   }
// // }
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { User } from "@/models/user";
// import { connectDB } from "@/lib/db";

// export async function PUT(request: Request) {
//   try {
//     await connectDB();

//     const authHeader = request.headers.get('Authorization');
//     if (!authHeader) {
//       return NextResponse.json({ error: "No token" }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
//     const body = await request.json();

//     // Find the user first
//     const existingUser = await User.findById(decoded.id);
//     if (!existingUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // Update only fields that are provided
//     existingUser.name = body.name || existingUser.name;
//     existingUser.email = body.email || existingUser.email; // keep email if not sent
//     existingUser.image = body.image || existingUser.image; // keep existing image if not changed

//     await existingUser.save();

//     return NextResponse.json({
//       message: "Profile updated successfully",
//       user: {
//         id: existingUser._id,
//         name: existingUser.name,
//         email: existingUser.email,
//         image: existingUser.image
//       }
//     });
//   } catch (error) {
//     console.error("Update error:", error);
//     return NextResponse.json({ error: "Update failed" }, { status: 400 });
//   }
// }
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/models/user";
import { connectDB } from "@/lib/db";

export async function PUT(request: Request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const body = await request.json();

    const existingUser = await User.findById(decoded.id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update only non-empty fields
    if (body.name && body.name.trim() !== "") existingUser.name = body.name;
    if (body.email && body.email.trim() !== "") existingUser.email = body.email;
    if (body.image && body.image.trim() !== "") existingUser.image = body.image;

    await existingUser.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        image: existingUser.image,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Update failed" },
      { status: 400 }
    );
  }
}
