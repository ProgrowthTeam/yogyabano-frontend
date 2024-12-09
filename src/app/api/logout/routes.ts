import { NextResponse } from "next/server";
import { logout } from "../../services/logout";

export async function POST() {

  try {
    const { error } = await logout();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    return NextResponse.json({ error: `Error logging out error ${error}` }, { status: 500 });
  }
}
