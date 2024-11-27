import { NextRequest, NextResponse } from "next/server";
import { signUpUser } from "../../services/signup";

export async function POST(req: NextRequest) {
  const { email, password, options} = await req.json();

  try {
    const { data, error } = await signUpUser(email, password, options);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Sign up successful", data });
  } catch (error) {
    return NextResponse.json({ error: `Error signing up error ${error}` }, { status: 500 });
  }
}
