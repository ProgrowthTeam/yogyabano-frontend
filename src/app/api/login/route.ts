import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "../../services/login";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const { data, error } = await loginUser(email, password);
    console.log("Supabase response:", { data, error });

    if (error) {
      console.error("Login error:", error);
      return NextResponse.json({ error }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Error logging in" }, { status: 500 });
  }
}
