<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-2xl text-gray-800 leading-tight">
            {{ __('Overview') }}
        </h2>
    </x-slot>

    <div class="py-6 sm:py-8 lg:py-12 bg-transparent">
        <div class="max-w-7xl mx-auto space-y-6">
            
            <!-- Welcome Banner -->
            <div class="bg-indigo-600 rounded-2xl shadow-xl overflow-hidden relative">
                <div class="absolute inset-0 bg-indigo-700 opacity-20 transform -skew-x-12"></div>
                <div class="relative p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between">
                    <div class="text-white">
                        <h3 class="text-3xl font-bold mb-2">Welcome back, {{ Auth::user()->name }}!</h3>
                        <p class="text-indigo-100 text-lg">Manage your salary details and track your monthly progress effortlessly.</p>
                    </div>
                    <div class="mt-6 sm:mt-0">
                        <a href="{{ route('salaries.index') }}" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 transition duration-300">
                            Add Salary Details
                        </a>
                    </div>
                </div>
            </div>

            <!-- Stats Overview -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Stat Card 1 -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between hover:shadow-md transition duration-300">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Last Month Salary</p>
                            <h4 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ $latestSalary ? '₹' . number_format($latestSalary->final_salary) : '--' }}</h4>
                        </div>
                        <div class="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center text-sm">
                        <span class="text-gray-400 dark:text-gray-500">{{ $latestSalary ? $latestSalary->month . ' ' . $latestSalary->year : 'Waiting for data' }}</span>
                    </div>
                </div>

                <!-- Stat Card 2 -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between hover:shadow-md transition duration-300">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Working Days</p>
                            <h4 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ $latestSalary ? $latestSalary->total_working_days : '--' }}</h4>
                        </div>
                        <div class="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center text-sm">
                        <span class="text-gray-400 dark:text-gray-500">{{ $latestSalary ? $latestSalary->month . ' ' . $latestSalary->year : 'Waiting for data' }}</span>
                    </div>
                </div>

                <!-- Stat Card 3 -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between hover:shadow-md transition duration-300">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Attendance Stats</p>
                            <h4 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                @if($latestSalary)
                                    <span class="text-green-500">P: {{ $latestSalary->total_present_days }}</span> / <span class="text-red-500">A: {{ $latestSalary->total_absent_days }}</span>
                                @else
                                    --
                                @endif
                            </h4>
                        </div>
                        <div class="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center text-sm">
                        <span class="text-gray-400 dark:text-gray-500">{{ $latestSalary ? $latestSalary->month . ' ' . $latestSalary->year : 'Waiting for data' }}</span>
                    </div>
                </div>
            </div>

            </div>

        </div>
    </div>
</x-app-layout>
