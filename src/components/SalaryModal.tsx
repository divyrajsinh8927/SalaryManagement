"use client";

import { useState, useEffect } from "react";
import { createSalary, updateSalary } from "@/actions/salary";

interface Salary {
  id: string;
  month: string;
  year: number;
  actual_salary: number;
  total_working_days: number;
  total_absent_days: number;
  esic_percent: number;
  tax: number;
  pf: number;
  [key: string]: any;
}

interface SalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  salaryData?: Salary | null; // if null, it's create mode
}

export default function SalaryModal({ isOpen, onClose, salaryData }: SalaryModalProps) {
  const isEdit = !!salaryData;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    month: "",
    year: new Date().getFullYear(),
    actual_salary: "",
    total_working_days: "",
    total_absent_days: "0",
    esic_percent: "",
    tax: "",
    pf: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (salaryData) {
        setFormData({
          month: salaryData.month,
          year: salaryData.year,
          actual_salary: String(salaryData.actual_salary),
          total_working_days: String(salaryData.total_working_days),
          total_absent_days: String(salaryData.total_absent_days),
          esic_percent: String(salaryData.esic_percent),
          tax: String(salaryData.tax),
          pf: String(salaryData.pf),
        });
      } else {
        setFormData({
          month: "",
          year: new Date().getFullYear(),
          actual_salary: "",
          total_working_days: "",
          total_absent_days: "0",
          esic_percent: "",
          tax: "",
          pf: "",
        });
      }
    }
  }, [isOpen, salaryData]);

  if (!isOpen) return null;

  const w = parseInt(formData.total_working_days) || 0;
  const a = parseInt(formData.total_absent_days) || 0;
  const presentDays = w - a < 0 ? 0 : w - a;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && salaryData?.id) {
        await updateSalary(salaryData.id, formData);
      } else {
        await createSalary(formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        {/* Modal Panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-100 dark:border-gray-700 relative z-10">
          
          <div className="px-6 pt-6 pb-4 sm:p-8 sm:pb-6">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight" id="modal-title">
                {isEdit ? 'Edit Salary' : 'Add New Salary'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none transition-colors bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Period Section */}
              <div className="bg-gray-50/50 dark:bg-gray-900/20 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4">Salary Period</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="month" className="block font-medium text-sm text-gray-700 dark:text-gray-300">Month</label>
                    <select 
                      id="month" 
                      name="month" 
                      value={formData.month}
                      onChange={(e) => setFormData({...formData, month: e.target.value})}
                      className="mt-1 block w-full border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm transition duration-200 py-2.5 px-4" 
                      required
                    >
                      <option value="" disabled>Select Month</option>
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="year" className="block font-medium text-sm text-gray-700 dark:text-gray-300">Year</label>
                    <input 
                      id="year" 
                      name="year" 
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: parseInt(e.target.value) || new Date().getFullYear()})}
                      type="number" 
                      min="2000" 
                      max="2100" 
                      className="mt-1 block w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-white rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-4" 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Earnings & Attendance Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50/50 dark:bg-gray-900/20 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4">Earnings</h4>
                  <div>
                    <label htmlFor="actual_salary" className="block font-medium text-sm text-gray-700 dark:text-gray-300">Base Salary (Gross)</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm font-bold">₹</span>
                      </div>
                      <input 
                        id="actual_salary" 
                        name="actual_salary" 
                        value={formData.actual_salary}
                        onChange={(e) => setFormData({...formData, actual_salary: e.target.value})}
                        type="number" 
                        step="0.01" 
                        className="pl-9 block w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-white text-lg font-semibold rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-4" 
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-gray-900/20 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4">Attendance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="total_working_days" className="block font-medium text-sm text-gray-700 dark:text-gray-300">Working Days</label>
                      <input 
                        id="total_working_days" 
                        name="total_working_days" 
                        value={formData.total_working_days}
                        onChange={(e) => setFormData({...formData, total_working_days: e.target.value})}
                        type="number" 
                        className="mt-1 block w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-white font-medium rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-4" 
                        required 
                      />
                    </div>
                    <div>
                      <label htmlFor="total_absent_days" className="block font-medium text-sm text-gray-700 dark:text-gray-300">Absent</label>
                      <input 
                        id="total_absent_days" 
                        name="total_absent_days" 
                        value={formData.total_absent_days}
                        onChange={(e) => setFormData({...formData, total_absent_days: e.target.value})}
                        type="number" 
                        step="0.5" 
                        className="mt-1 block w-full bg-white dark:bg-gray-800 border-red-300 dark:border-red-500/50 dark:text-white font-medium focus:border-red-500 focus:ring-red-500 rounded-xl shadow-sm py-2.5 px-4" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                    <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Present Days:</span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{presentDays}</span>
                  </div>
                </div>
              </div>

              {/* Deductions Section */}
              <div className="bg-gray-50/50 dark:bg-gray-900/20 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 pb-6">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4">Fixed Deductions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label htmlFor="esic_percent" className="block font-medium text-sm text-gray-700 dark:text-gray-300">ESIC (%)</label>
                    <div className="relative mt-1">
                      <input 
                        id="esic_percent" 
                        name="esic_percent" 
                        value={formData.esic_percent}
                        onChange={(e) => setFormData({...formData, esic_percent: e.target.value})}
                        type="number" 
                        step="0.01" 
                        className="pr-8 block w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-white rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-4" 
                        required 
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm font-bold">%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="tax" className="block font-medium text-sm text-gray-700 dark:text-gray-300">Tax</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input 
                        id="tax" 
                        name="tax" 
                        value={formData.tax}
                        onChange={(e) => setFormData({...formData, tax: e.target.value})}
                        type="number" 
                        step="0.01" 
                        className="pl-7 block w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-white rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-4" 
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="pf" className="block font-medium text-sm text-gray-700 dark:text-gray-300">PF</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input 
                        id="pf" 
                        name="pf" 
                        value={formData.pf}
                        onChange={(e) => setFormData({...formData, pf: e.target.value})}
                        type="number" 
                        step="0.01" 
                        className="pl-7 block w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-white rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-4" 
                        required 
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="bg-gray-100/50 dark:bg-gray-900/50 px-6 py-5 -mx-6 -mb-6 sm:-mx-8 sm:-mb-6 flex flex-col-reverse sm:flex-row-reverse sm:gap-3 rounded-b-3xl border-t border-gray-200 dark:border-gray-700">
                <button disabled={loading} type="submit" className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl border border-transparent shadow-md px-8 py-2.5 bg-indigo-600 text-base font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition mt-3 sm:mt-0 disabled:opacity-50">
                  {loading ? 'Saving...' : (isEdit ? 'Update Details' : 'Save Salary')}
                </button>
                <button type="button" onClick={onClose} className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm px-6 py-2.5 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
