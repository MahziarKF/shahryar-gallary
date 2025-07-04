import getSupportMessages from "@/lib/supportMessages";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const messages = await getSupportMessages(Number(userId));
    return NextResponse.json(
      { message: "Retrived messages successfuly.", messages },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "server error." }, { status: 500 });
  }
}
