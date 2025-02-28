<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Data\SearchableInstitutionData;
use App\Data\TellerInstitutionItemData;
use App\Jobs\ProcessInstitutionLogos;
use App\Services\MeilisearchService;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;

final class InstitutionsGetCommand extends Command
{
    /**
     * Priority institutions ordered by popularity (highest first)
     *
     * @var array<string>
     */
    private const array PRIORITY_INSTITUTIONS = [
        // US
        'chase', // Chase
        'wells_fargo', // Wells Fargo
        'bank_of_america', // Bank Of America
        'pnc', // PNC
        'credit_one', // CreditOne
        'capital_one', // CapitalOne
        'us_bank', // US Bank
        'usaa', // USAA
        'mercury', // Mercury
        'citibank', // Citibank
        'silicon_valley_bank', // Silicon Valley Bank
        'first_republic', // First Republic
        'brex', // Brex
        'amex', // American Express
        'ins_133680', // Angel List
        'morgan_stanley', // Morgan Stanley
        'truist', // Truist
        'td_bank', // TD Bank
        'ins_29', // KeyBank
        'ins_19', // Regions Bank
        'fifth_third', // Fifth Third Bank
        'ins_111098', // Citizens Bank
        'ins_100103', // Comerica Bank
        'ins_21', // Huntington Bank
    ];

    /**
     * Batch size for processing institutions
     */
    private const int BATCH_SIZE = 100;

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

    public function __construct(private readonly MeilisearchService $meilisearch)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->getTellerInstitutions();

        $this->info('All institution batches have been dispatched to jobs for processing');
    }

    /**
     * Get list of banking institutions from Teller API
     */
    private function getTellerInstitutions(): void
    {
        try {
            $response = Http::get('https://api.teller.io/institutions');

            if (! $response->successful()) {
                $this->error('Teller API request failed with status: '.$response->status());

                return;
            }

            $institutions = TellerInstitutionItemData::collect((array) $response->json(), Collection::class);

            // Convert to SearchableInstitutionData objects
            $allInstitutions = $institutions->map(fn ($institution): SearchableInstitutionData => new SearchableInstitutionData(
                id: $institution->id,
                name: $institution->name,
                logo: '',
                countries: ['US'],
                popularity: $this->getPopularity($institution->id) > 0 ? $this->getPopularity($institution->id) : 10, // We want to rank Teller institutions higher than others
                provider: 'teller',
            ));

            // Create institutions with processing data
            $institutionsWithProcessingData = $allInstitutions->map(fn ($institutionData) => [
                ...$institutionData->toArray(),
                'imageUrl' => "https://cdn.teller.io/web/images/banks/{$institutionData->id}.jpg",
                'folder' => 'banks',
            ]);

            // Add basic institution data to Meilisearch first
            // This ensures users have some data to search even before logos are processed
            $this->meilisearch->addDocuments('institutions', $allInstitutions->toArray());

            $this->info('Added '.count($allInstitutions).' institutions to Meilisearch (without logos)');

            // Process in batches of 100
            $totalInstitutions = $institutionsWithProcessingData->count();
            $batches = $institutionsWithProcessingData->chunk(self::BATCH_SIZE);
            $batchCount = $batches->count();

            $this->info("Dispatching {$totalInstitutions} institutions in {$batchCount} batches to jobs");

            // Dispatch all batches to jobs
            $batchNumber = 1;
            foreach ($batches as $batch) {
                /** @var array<int, array<string, mixed>> $typedBatch */
                $typedBatch = $batch->toArray();
                ProcessInstitutionLogos::dispatch($typedBatch);

                $this->info("Dispatched batch {$batchNumber} of {$batchCount} with ".count($batch).' institutions');

                $batchNumber++;
            }

        } catch (Exception $e) {
            $this->error('Failed to fetch Teller institutions: '.$e->getMessage());
        }
    }

    /**
     * Get popularity score for an institution based on priority list
     */
    private function getPopularity(string $id): int
    {
        if (in_array($id, self::PRIORITY_INSTITUTIONS)) {
            return 100 - array_search($id, self::PRIORITY_INSTITUTIONS);
        }

        return 0;
    }
}
