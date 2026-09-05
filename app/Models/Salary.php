<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salary extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'actual_salary',
        'total_working_days',
        'total_present_days',
        'total_absent_days',
        'esic_percent',
        'tax',
        'pf',
        'month',
        'year',
        'cutoff',
        'final_salary',
        'esic_money',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
