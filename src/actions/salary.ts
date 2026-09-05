"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createSalary(data: any) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Calculate fields
  const baseSalary = parseFloat(data.actual_salary)
  const workingDays = parseInt(data.total_working_days)
  const absentDays = parseFloat(data.total_absent_days)
  
  const presentDays = workingDays - absentDays
  const perDaySalary = baseSalary / workingDays
  const cutoff = perDaySalary * absentDays
  
  const esicPercent = parseFloat(data.esic_percent)
  const esicMoney = (baseSalary - cutoff) * (esicPercent / 100)
  const tax = parseFloat(data.tax)
  const pf = parseFloat(data.pf)
  
  const finalSalary = baseSalary - cutoff - esicMoney - tax - pf

  await prisma.salaries.create({
    data: {
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
    }
  })

  revalidatePath("/salaries")
}

export async function updateSalary(id: string, data: any) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Calculate fields
  const baseSalary = parseFloat(data.actual_salary)
  const workingDays = parseInt(data.total_working_days)
  const absentDays = parseFloat(data.total_absent_days)
  
  const presentDays = workingDays - absentDays
  const perDaySalary = baseSalary / workingDays
  const cutoff = perDaySalary * absentDays
  
  const esicPercent = parseFloat(data.esic_percent)
  const esicMoney = (baseSalary - cutoff) * (esicPercent / 100)
  const tax = parseFloat(data.tax)
  const pf = parseFloat(data.pf)
  
  const finalSalary = baseSalary - cutoff - esicMoney - tax - pf

  await prisma.salaries.update({
    where: {
      id: BigInt(id),
      user_id: BigInt(session.user.id)
    },
    data: {
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
    }
  })

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
