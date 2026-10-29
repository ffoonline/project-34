import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export async function assertAdmin() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
