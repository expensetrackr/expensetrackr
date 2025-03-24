<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

final class CategoryController
{
    public function index(Request $request)
    {
        return Inertia::render('categories/page');
    }
}
