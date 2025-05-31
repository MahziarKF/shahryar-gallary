import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// Initialize Prisma Client outside of the handlers
const prisma = new PrismaClient();

// GET handler — fetch user by name
export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  const { name } = params;
  try {
    const user = await prisma.example.findFirst({
      where: { name },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// export async function PUT(
//   req: Request,
//   { params }: { params: { name: string } }
// ) {
//   const { name } = params;
//   try {
//     const user = await prisma.example.findFirst({
//       where: { name: name }, // Corrected the where clause
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const updatedUser = await prisma.example.update({
//       where: { name: name }, // Corrected the where clause to use the name from params
//       data: { isGay: true },
//     });

//     return NextResponse.json(updatedUser); // Return the updated user data
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

export async function PUT(
  request: Request, // Next.js passes the request object here
  { params }: { params: { value: string } } // This correctly extracts your dynamic segment 'value'
) {
  const { value } = params; // Access the dynamic parameter as 'value'

  console.log(`--- Server Log: PUT request received for value: ${value} ---`);

  // Send a simple, successful response
  return NextResponse.json(
    { message: `Successfully received PUT for: ${value}` },
    { status: 200 }
  );
}
