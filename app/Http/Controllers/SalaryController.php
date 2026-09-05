<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SalaryController extends Controller
{
    public function index(Request $request)
    {
        $currentYear = date('Y');
        $selectedYear = $request->input('year', $currentYear);
        
        $salariesQuery = Auth::user()->salaries();
        
        if ($selectedYear && $selectedYear !== 'all') {
            $salariesQuery->where('year', $selectedYear);
        }

        // Fetch filtered salaries and sort them chronologically
        $salaries = $salariesQuery->get()->sortByDesc(function ($salary) {
            $monthNum = date('m', strtotime($salary->month));
            return $salary->year . '-' . $monthNum;
        });

        // Get unique years for the filter dropdown
        $availableYears = Auth::user()->salaries()->select('year')->distinct()->pluck('year');
        if (!$availableYears->contains($currentYear)) {
            $availableYears->push($currentYear);
        }
        $availableYears = $availableYears->sortDesc()->values();

        // Fetch the latest salary to pre-fill the modal form
        $latestSalary = Auth::user()->salaries()->latest()->first();

        // Calculate summary metrics for the currently filtered salaries
        $totalCredited = $salaries->sum('final_salary');
        $totalCutoff = $salaries->sum('cutoff');
        
        return view('salaries.index', compact('salaries', 'latestSalary', 'selectedYear', 'availableYears', 'totalCredited', 'totalCutoff'));
    }

    public function store(Request $request)
    {
        $validated = $this->validateSalary($request);
        $validated = $this->calculateSalary($validated);

        Auth::user()->salaries()->create($validated);

        return redirect()->route('salaries.index')->with('status', 'Salary entry added successfully.');
    }



    public function update(Request $request, $id)
    {
        $salary = Auth::user()->salaries()->findOrFail($id);
        
        $validated = $this->validateSalary($request);
        $validated = $this->calculateSalary($validated);

        $salary->update($validated);

        return redirect()->route('salaries.index')->with('success', 'Salary entry updated successfully.');
    }

    public function destroy($id)
    {
        $salary = Auth::user()->salaries()->findOrFail($id);
        $salary->delete();

        return redirect()->route('salaries.index')->with('success', 'Salary entry deleted successfully.');
    }

    private function validateSalary(Request $request)
    {
        return $request->validate([
            'actual_salary' => 'required|numeric|min:0',
            'total_working_days' => 'required|integer|min:1',
            'total_absent_days' => 'required|integer|min:0',
            'esic_percent' => 'required|numeric|min:0|max:100',
            'tax' => 'required|numeric|min:0',
            'pf' => 'required|numeric|min:0',
            'month' => 'required|string',
            'year' => 'required|integer',
        ]);
    }

    private function calculateSalary(array $data)
    {
        $actual_salary = (float) $data['actual_salary'];
        $total_working_days = (int) $data['total_working_days'];
        $total_absent_days = (int) $data['total_absent_days'];
        
        // Calculate Present Days
        $total_present_days = $total_working_days - $total_absent_days;
        $data['total_present_days'] = $total_present_days;
        
        $one_day_salary = $actual_salary / $total_working_days;
        $total_present_day_salary = $total_present_days * $one_day_salary;
        
        $cutoff = $actual_salary - $total_present_day_salary;
        
        $esic_percent = (float) $data['esic_percent'];
        $esic_money = $total_present_day_salary * ($esic_percent / 100);
        
        $salary_after_esic = $total_present_day_salary - $esic_money;
        
        $tax = (float) $data['tax'];
        $salary_after_tax = $salary_after_esic - $tax;
        
        $pf = (float) $data['pf'];
        $final_salary = $salary_after_tax - $pf;

        // Assign calculated values
        $data['cutoff'] = round($cutoff, 2);
        $data['esic_money'] = round($esic_money, 2);
        $data['final_salary'] = round($final_salary); // Standard rounding (>=.5 goes up, <.5 goes down)

        return $data;
    }
}
