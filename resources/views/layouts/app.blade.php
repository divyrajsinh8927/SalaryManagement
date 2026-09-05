<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-screen overflow-hidden {{ Auth::check() ? Auth::user()->theme : 'light' }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Salary Management') }} | Track & Manage Employee Salaries</title>
        
        <!-- SEO & Meta Tags -->
        <meta name="description" content="The premier Salary Management application to track employee payroll, attendances, and automated cutoff calculations.">
        <meta name="keywords" content="Salary Management, Payroll, Attendance Tracking, eTime Integration, Employee Management, Cutoff Salary, Net Salary">
        <meta name="author" content="Salary Management System">

        <!-- Open Graph / Social Media Meta Tags -->
        <meta property="og:title" content="{{ config('app.name', 'Salary Management') }} | Track & Manage Employee Salaries">
        <meta property="og:description" content="The premier Salary Management application to track employee payroll, attendances, and automated cutoff calculations.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url('/') }}">
        <meta property="og:image" content="{{ asset('favicon.ico') }}">
        <meta property="og:site_name" content="{{ config('app.name', 'Salary Management') }}">

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        
        <!-- SweetAlert2 -->
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

        <script>
            // Apply theme on load if guest (Auth check handles logged in users)
            @guest
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            @endguest

            function toggleTheme() {
                const htmlClasses = document.documentElement.classList;
                let newTheme = 'light';
                
                if (htmlClasses.contains('dark')) {
                    htmlClasses.remove('dark');
                } else {
                    htmlClasses.add('dark');
                    newTheme = 'dark';
                }

                // Save to local storage for guests
                localStorage.theme = newTheme;

                // Send AJAX to save in DB if logged in
                @auth
                    fetch("{{ route('theme.update') }}", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                        },
                        body: JSON.stringify({ theme: newTheme })
                    });
                @endauth
            }
        </script>
    </head>
    <body class="font-sans antialiased text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 h-screen overflow-hidden relative">
        
        <!-- Premium Background styling -->
        <div class="fixed inset-0 z-[-1] pointer-events-none">
            <!-- Light Mode Background -->
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-gray-50 to-gray-50 dark:hidden"></div>
            <!-- Dark Mode Background -->
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/30 via-gray-900 to-gray-900 hidden dark:block"></div>
        </div>

        <div x-data="{ sidebarOpen: false }" class="h-full flex relative z-0">
            
            <!-- Sidebar -->
            @include('layouts.sidebar')

            <!-- Main Content Area -->
            <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                
                <!-- Mobile Header -->
                <div class="md:hidden flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                    <a href="{{ route('dashboard') }}">
                        <x-application-logo class="w-10 h-10" />
                    </a>
                    <button @click="sidebarOpen = true" class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                <!-- Page Heading -->
                @isset($header)
                    <header class="bg-white dark:bg-gray-800 shadow z-10 hidden md:block">
                        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            {{ $header }}
                        </div>
                    </header>
                @endisset

                <!-- Page Content -->
                <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {{ $slot }}
                </main>
            </div>

            <!-- Floating Theme Toggle Button -->
            <button onclick="toggleTheme()" class="fixed bottom-6 right-6 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all z-50">
                <!-- Sun Icon for Light Mode -->
                <svg class="w-6 h-6 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                <!-- Moon Icon for Dark Mode -->
                <svg class="w-6 h-6 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            </button>
            
        </div>
    </body>
</html>
