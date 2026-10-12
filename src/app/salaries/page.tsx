import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SalariesContent from "./SalariesContent";

const MONTH_ORDER: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

const getMonthIndex = (m: string) => MONTH_ORDER[m?.toLowerCase()?.trim()] || 0;

interface SalariesPageProps {
  searchParams: Promise<{ year?: string }>;
}

export default async function SalariesPage({ searchParams }: SalariesPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/");
  }

  const { year: yearParam } = await searchParams;
  const year = yearParam || "all";
  
  const whereClause: any = { user_id: BigInt(session.user.id) };
  if (year !== "all") {
    whereClause.year = parseInt(year);
  }

  const salariesRaw = await prisma.salaries.findMany({
    where: whereClause,
    orderBy: [
      { year: "desc" },
      { id: "desc" } 
    ]
  });

  const salaries = salariesRaw.map(s => ({
    ...s,
    id: s.id.toString(),
    user_id: s.user_id.toString(),
    actual_salary: Number(s.actual_salary),
    esic_percent: Number(s.esic_percent),
    tax: Number(s.tax),
    pf: Number(s.pf),
    cutoff: Number(s.cutoff || 0),
    final_salary: Number(s.final_salary || 0),
    esic_money: Number(s.esic_money || 0),
    total_working_days: Number(s.total_working_days),
    total_absent_days: Number(s.total_absent_days),
    total_present_days: Number(s.total_present_days),
  }));

  salaries.sort((a, b) => {
    if (b.year !== a.year) {
      return b.year - a.year;
    }
    const monthDiff = getMonthIndex(b.month) - getMonthIndex(a.month);
    if (monthDiff !== 0) {
      return monthDiff;
    }
    return Number(b.id) - Number(a.id);
  });

  const totalCredited = salaries.reduce((acc, curr) => acc + curr.final_salary, 0);
  const totalCutoff = salaries.reduce((acc, curr) => acc + curr.cutoff, 0);

  const allUserSalaries = await prisma.salaries.findMany({
    where: { user_id: BigInt(session.user.id) },
    select: { year: true },
    distinct: ['year'],
    orderBy: { year: 'desc' }
  });
  
  const availableYears = allUserSalaries.map(s => s.year);

  return (
    <SalariesContent 
      salaries={salaries} 
      totalCredited={totalCredited} 
      totalCutoff={totalCutoff} 
      year={year} 
      availableYears={availableYears} 
    />
  );
}
