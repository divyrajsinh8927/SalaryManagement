<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
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
    </head>
    <body class="font-sans text-gray-900 antialiased relative min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8">
        
        <!-- Decorative Background -->
        <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div class="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-200 blur-3xl opacity-50 mix-blend-multiply"></div>
            <div class="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-teal-100 blur-3xl opacity-60 mix-blend-multiply"></div>
            <div class="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-blue-100 blur-3xl opacity-50 mix-blend-multiply"></div>
        </div>

        <div class="w-full sm:max-w-md lg:max-w-lg z-10">
            <div class="text-center mb-8">
                <a href="/" class="inline-block">
                    <x-application-logo class="w-20 h-20 mx-auto object-contain drop-shadow-sm rounded-xl" />
                </a>
                <h2 class="mt-6 text-3xl font-bold text-gray-900 tracking-tight">
                    {{ $title ?? 'Welcome back' }}
                </h2>
                <p class="mt-2 text-sm text-gray-500">
                    {{ $subtitle ?? 'Please enter your details to continue.' }}
                </p>
            </div>

            <div class="bg-white/80 backdrop-blur-xl shadow-2xl border border-white/50 overflow-hidden rounded-3xl p-8 sm:p-10">
                {{ $slot }}
            </div>
            
            <div class="mt-8 text-center text-sm text-gray-500">
                &copy; {{ date('Y') }} Salary Management. All rights reserved.
            </div>
        </div>
    </body>
</html>
