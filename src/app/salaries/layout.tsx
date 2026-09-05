"use client"

import { signOut, useSession } from "next-auth/react"
import { LogOut } from "lucide-react"
import Link from "next/link"

export default function SalariesLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="shrink-0 flex items-center">
                <Link href="/salaries">
                  <img src="/logo.jpg" alt="Logo" className="block h-9 w-auto rounded-full" />
                </Link>
              </div>
              <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                <Link href="/salaries" className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-400 text-sm font-medium leading-5 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out">
                  Dashboard
                </Link>
              </div>
            </div>
            <div className="hidden sm:flex sm:items-center sm:ml-6">
              <div className="ml-3 relative flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{session?.user?.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                >
                  Log Out
                  <LogOut className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {children}
      </main>
    </div>
  )
}
