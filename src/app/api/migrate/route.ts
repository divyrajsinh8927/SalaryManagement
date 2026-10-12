import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE salaries 
      ALTER COLUMN total_working_days TYPE numeric(5, 2) USING total_working_days::numeric(5, 2);
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE salaries 
      ALTER COLUMN total_absent_days TYPE numeric(5, 2) USING total_absent_days::numeric(5, 2);
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE salaries 
      ALTER COLUMN total_present_days TYPE numeric(5, 2) USING total_present_days::numeric(5, 2);
    `);
    return NextResponse.json({
      success: true,
      message: "Database columns total_absent_days and total_present_days successfully migrated to numeric(5, 2)!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
