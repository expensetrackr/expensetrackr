<?php

declare(strict_types=1);

use App\Actions\Categories\CreateSystemCategories;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('seeds system categories idempotently', function (): void {
    /** @var Workspace $workspace */
    $workspace = Workspace::factory()->create();

    $action = app(CreateSystemCategories::class);

    // First run
    $action->handle($workspace);
    $firstCount = $workspace->categories()->count();

    expect($firstCount)->toBeGreaterThan(0);

    // Second run (should not create duplicates)
    $action->handle($workspace);

    expect($workspace->categories()->count())->toBe($firstCount);
});
