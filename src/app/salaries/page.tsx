import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SalariesContent from "./SalariesContent";

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
  
  const whereClause: any = { userId: session.user.id };
  if (year !== "all") {
    whereClause.year = parseInt(year);
  }

  const salaries = await prisma.salary.findMany({
    where: whereClause,
    orderBy: [
      { year: "desc" },
      { id: "desc" } 
    ]
  });

  const totalCredited = salaries.reduce((acc, curr) => acc + curr.final_salary, 0);
  const totalCutoff = salaries.reduce((acc, curr) => acc + curr.cutoff, 0);

  const allUserSalaries = await prisma.salary.findMany({
    where: { userId: session.user.id },
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
