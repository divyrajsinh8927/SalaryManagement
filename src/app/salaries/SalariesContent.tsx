"use client";

import { useState } from "react";
import SalaryModal from "@/components/SalaryModal";
import { deleteSalary } from "@/actions/salary";
import { useRouter } from "next/navigation";

export default function SalariesContent({ salaries, totalCredited, totalCutoff, year, availableYears }: any) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<any>(null);

  const openCreate = () => {
    setEditingSalary(null);
    setModalOpen(true);
  };

  const openEdit = (salary: any) => {
    setEditingSalary(salary);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? You won't be able to revert this!")) {
      try {
        await deleteSalary(id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/salaries?year=${e.target.value}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center w-full">
            <h2 className="font-semibold text-2xl text-gray-800 dark:text-gray-200 leading-tight drop-shadow-sm">
              My Salaries
            </h2>
            <button onClick={openCreate} className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-xl font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 transition ease-in-out duration-150 shadow-md hover:shadow-lg">
              <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Salary
            </button>
          </div>
        </div>
      </header>

      <div className="py-6 sm:py-8 lg:py-12 bg-transparent">
        <div className="max-w-7xl mx-auto space-y-6 sm:px-6 lg:px-8">

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 sm:rounded-3xl">
            <div className="p-4 sm:p-8">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Salary History</h3>
                <div className="flex items-center space-x-2">
                  <label htmlFor="year_filter" className="text-sm font-medium text-gray-600 dark:text-gray-400">Year:</label>
                  <select 
                    id="year_filter" 
                    value={year} 
                    onChange={handleYearChange} 
                    className="block w-28 sm:w-32 border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm py-1.5 px-3 text-sm transition"
                  >
                    <option value="all">All Years</option>
                    {availableYears.map((y: number) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/30 dark:to-gray-800 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 shadow-sm relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-100 dark:bg-indigo-900/40 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-1 relative z-10">
                    Total Credited Salary ({year === 'all' ? 'All Time' : year})
                  </div>
                  <div className="text-3xl font-extrabold text-indigo-900 dark:text-indigo-100 relative z-10">
                    ₹{totalCredited.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/30 dark:to-gray-800 p-5 rounded-2xl border border-red-100 dark:border-red-800/50 shadow-sm relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-100 dark:bg-red-900/40 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="text-sm text-red-600 dark:text-red-400 font-medium mb-1 relative z-10">
                    Total Cutoff Salary ({year === 'all' ? 'All Time' : year})
                  </div>
                  <div className="text-3xl font-extrabold text-red-900 dark:text-red-100 relative z-10">
                    ₹{totalCutoff.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {salaries.length === 0 ? (
                <div className="text-center py-12 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
                  <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No entries yet</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new salary record.</p>
                  <div className="mt-6">
                    <button onClick={openCreate} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      New Entry
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* DESKTOP TABLE VIEW */}
                  <div className="hidden md:block overflow-x-auto pb-4">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Month/Year</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base Salary</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attendance</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cutoff (Absent)</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fixed Deductions</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Final Salary</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-transparent divide-y divide-gray-100 dark:divide-gray-700/50">
                        {salaries.map((salary: any) => (
                          <tr key={salary.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold text-gray-900 dark:text-white">{salary.month}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{salary.year}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-200">₹{salary.actual_salary.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-200">{salary.total_present_days} / {salary.total_working_days} Days</div>
                              <div className="text-xs text-red-500 dark:text-red-400">Absent: {salary.total_absent_days}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {salary.cutoff > 0 ? (
                                <div className="text-sm text-red-600 dark:text-red-400 font-medium">- ₹{salary.cutoff.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                              ) : (
                                <div className="text-sm text-green-600 dark:text-green-400 font-medium">₹0.00</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <div className="w-48 space-y-1">
                                <div className="flex justify-between"><span className="text-gray-400">ESIC ({salary.esic_percent}%):</span> <span className="font-medium text-gray-800 dark:text-gray-200">₹{salary.esic_money.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Tax:</span> <span className="font-medium text-gray-800 dark:text-gray-200">₹{salary.tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">PF:</span> <span className="font-medium text-gray-800 dark:text-gray-200">₹{salary.pf.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 inline-flex text-sm font-bold rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 shadow-sm border border-green-200 dark:border-green-800/50">
                                ₹{salary.final_salary.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button onClick={() => openEdit(salary)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg transition">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                                <button onClick={() => handleDelete(salary.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg transition">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE CARD VIEW */}
                  <div className="md:hidden space-y-4">
                    {salaries.map((salary: any) => (
                      <div key={salary.id} className="bg-gray-50 dark:bg-gray-700/40 rounded-2xl p-5 border border-gray-100 dark:border-gray-600 shadow-sm relative overflow-hidden">
                        
                        <div className="absolute top-4 right-4 flex space-x-2">
                          <button onClick={() => openEdit(salary)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                          <button onClick={() => handleDelete(salary.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>

                        <div className="border-b border-gray-200 dark:border-gray-600 pb-3 mb-3 pr-20">
                          <div className="text-xl font-bold text-gray-900 dark:text-white">{salary.month} {salary.year}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{salary.total_present_days} / {salary.total_working_days} Days Present</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Base Salary</div>
                            <div className="font-semibold text-gray-800 dark:text-gray-200 text-lg">₹{salary.actual_salary.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Cutoff ({salary.total_absent_days} Absent)</div>
                            {salary.cutoff > 0 ? (
                              <div className="font-semibold text-red-500 dark:text-red-400 text-lg">- ₹{salary.cutoff.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                            ) : (
                              <div className="font-semibold text-green-500 dark:text-green-400 text-lg">₹0.00</div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1 mb-4 text-sm bg-white dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>ESIC ({salary.esic_percent}%)</span>
                            <span>- ₹{salary.esic_money.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                          </div>
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Tax</span>
                            <span>- ₹{salary.tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                          </div>
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>PF</span>
                            <span>- ₹{salary.pf.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800/50 shadow-sm">
                          <span className="font-bold text-green-800 dark:text-green-500 uppercase tracking-wide text-sm">Final Salary</span>
                          <span className="text-2xl font-black text-green-700 dark:text-green-400">₹{salary.final_salary.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <SalaryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} salaryData={editingSalary} />
    </div>
  );
}
