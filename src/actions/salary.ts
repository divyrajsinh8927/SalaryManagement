"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

async function migrateColumnsIfNecessary() {
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
  } catch (e) {
    console.warn("Column migration notice:", e);
  }
}

export async function createSalary(data: any) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Calculate fields
  const baseSalary = parseFloat(data.actual_salary)
  const workingDays = parseFloat(data.total_working_days)
  const absentDays = parseFloat(data.total_absent_days)
  
  const presentDays = workingDays - absentDays
  const perDaySalary = baseSalary / workingDays
  const cutoff = Math.round(perDaySalary * absentDays * 100) / 100
  
  const esicPercent = parseFloat(data.esic_percent)
  const esicMoney = Math.round((baseSalary - cutoff) * (esicPercent / 100) * 100) / 100
  const tax = parseFloat(data.tax)
  const pf = parseFloat(data.pf)
  
  const finalSalary = Math.round((baseSalary - cutoff - esicMoney - tax - pf) * 100) / 100

  const payload = {
    user_id: BigInt(session.user.id),
    month: data.month,
    year: parseInt(data.year),
    actual_salary: baseSalary,
    total_working_days: workingDays,
    total_absent_days: absentDays,
    total_present_days: presentDays,
    cutoff: cutoff,
    esic_percent: esicPercent,
    esic_money: esicMoney,
    tax: tax,
    pf: pf,
    final_salary: finalSalary,
    created_at: new Date(),
    updated_at: new Date(),
  }

  try {
    await prisma.salaries.create({ data: payload })
  } catch (err: any) {
    if (
      err.message?.includes("22P03") ||
      err.message?.includes("binary data format") ||
      err.message?.includes("integer") ||
      err.message?.includes("numeric")
    ) {
      await migrateColumnsIfNecessary();
      await prisma.salaries.create({ data: payload });
    } else {
      throw err;
    }
  }

  revalidatePath("/salaries")
}

export async function updateSalary(id: string, data: any) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Calculate fields
  const baseSalary = parseFloat(data.actual_salary)
  const workingDays = parseFloat(data.total_working_days)
  const absentDays = parseFloat(data.total_absent_days)
  
  const presentDays = workingDays - absentDays
  const perDaySalary = baseSalary / workingDays
  const cutoff = Math.round(perDaySalary * absentDays * 100) / 100
  
  const esicPercent = parseFloat(data.esic_percent)
  const esicMoney = Math.round((baseSalary - cutoff) * (esicPercent / 100) * 100) / 100
  const tax = parseFloat(data.tax)
  const pf = parseFloat(data.pf)
  
  const finalSalary = Math.round((baseSalary - cutoff - esicMoney - tax - pf) * 100) / 100

  const updateData = {
    month: data.month,
    year: parseInt(data.year),
    actual_salary: baseSalary,
    total_working_days: workingDays,
    total_absent_days: absentDays,
    total_present_days: presentDays,
    cutoff: cutoff,
    esic_percent: esicPercent,
    esic_money: esicMoney,
    tax: tax,
    pf: pf,
    final_salary: finalSalary,
    updated_at: new Date(),
  }

  const whereClause = {
    id: BigInt(id),
    user_id: BigInt(session.user.id)
  }

  try {
    await prisma.salaries.update({
      where: whereClause,
      data: updateData,
    })
  } catch (err: any) {
    if (
      err.message?.includes("22P03") ||
      err.message?.includes("binary data format") ||
      err.message?.includes("integer") ||
      err.message?.includes("numeric")
    ) {
      await migrateColumnsIfNecessary();
      await prisma.salaries.update({
        where: whereClause,
        data: updateData,
      });
    } else {
      throw err;
    }
  }

  revalidatePath("/salaries")
}

export async function deleteSalary(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.salaries.delete({
    where: {
      id: BigInt(id),
      user_id: BigInt(session.user.id)
    }
  })
  revalidatePath("/salaries")
}
