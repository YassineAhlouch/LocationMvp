<?php

namespace App\Enums;

enum ExpenseStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Overdue = 'overdue';
}
