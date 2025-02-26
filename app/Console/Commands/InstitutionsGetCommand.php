<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Data\SearchableInstitutionData;
use App\Data\TellerInstitutionItemData;
use App\Services\MeilisearchService;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Spatie\LaravelData\DataCollection;

final class InstitutionsGetCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'institutions:get';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get list of banking institutions from supported providers';

    private MeilisearchService $meilisearch;

    public function __construct(MeilisearchService $meilisearch)
    {
        parent::__construct();
        $this->meilisearch = $meilisearch;
    }

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $institutions = array_merge([], $this->getTellerInstitutions());

        $this->meilisearch->addDocuments('institutions', $institutions);

        if ($this->output) {
            $this->info('Institutions added to Meilisearch: '.count($institutions));
        }
    }

    /**
     * Get list of banking institutions from Teller API
     *
     * @return array<SearchableInstitutionData>
     */
    private function getTellerInstitutions(): array
    {
        try {
            $response = Http::get('https://api.teller.io/institutions');

            if (! $response->successful()) {
                $this->error('Teller API request failed with status: '.$response->status());

                return [];
            }

            $institutions = TellerInstitutionItemData::collect((array) $response->json(), DataCollection::class);

            return $institutions->map(function ($institution) {
                return new SearchableInstitutionData(
                    id: $institution->id,
                    name: $institution->name,
                    logo: '',
                    countries: ['US'],
                    popularity: 10,
                    provider: 'teller',
                );
            })->toArray();
        } catch (Exception $e) {
            $this->error('Failed to fetch Teller institutions: '.$e->getMessage());

            return [];
        }
    }
}
