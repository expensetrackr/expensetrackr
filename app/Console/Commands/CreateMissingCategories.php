<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Actions\Categories\CreateSystemCategories;
use App\Models\Workspace;
use Illuminate\Console\Command;

final class CreateMissingCategories extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'categories:create-missing';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create missing system categories for all workspaces that don\'t have any';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        // Get all workspaces
        $workspaces = Workspace::all();

        foreach ($workspaces as $workspace) {
            if ($workspace->categories()->count() === 0) {
                $this->info("Creating categories for workspace {$workspace->id}");

                (new CreateSystemCategories())->handle($workspace);
            }
        }
    }
}
