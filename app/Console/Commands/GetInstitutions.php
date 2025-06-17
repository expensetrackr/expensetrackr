<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Data\Banking\TellerInstitutionItemData;
use App\Data\Finance\InstitutionSearchData;
use App\Enums\Banking\ProviderType;
use App\Jobs\ProcessInstitutionLogos;
use App\Services\MeilisearchService;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

final class GetInstitutions extends Command
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
     * Cache TTL in seconds (1 hour)
     */
    private const int CACHE_TTL = 3600;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'institutions:get {--force : Force refresh ignoring cache}';

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
        try {
            $this->getTellerInstitutions();
            $this->info('All institution batches have been dispatched to jobs for processing');
        } catch (Throwable $e) {
            Log::error('Failed to process institutions', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            $this->error('Failed to process institutions: '.$e->getMessage());
        }
    }

    /**
     * Get list of banking institutions from Teller API
     */
    private function getTellerInstitutions(): void
    {
        $cacheKey = 'teller_institutions';
        $forceRefresh = $this->option('force');

        if (! $forceRefresh && Cache::has($cacheKey)) {
            $this->info('Using cached institutions data');

            /** @var Collection<int, TellerInstitutionItemData> $institutions */
            $institutions = Cache::get($cacheKey);
        } else {
            $institutions = $this->fetchTellerInstitutions();
            Cache::put($cacheKey, $institutions, self::CACHE_TTL);
        }

        if ($institutions->isEmpty()) {
            $this->warn('No institutions found to process');

            return;
        }

        // Convert to SearchableInstitutionData objects
        $allInstitutions = $institutions->map(
            fn ($institution): InstitutionSearchData => new InstitutionSearchData(
                id: $institution->id,
                name: $institution->name,
                logo: '',
                countries: ['US'],
                popularity: $this->getPopularity($institution->id),
                provider: ProviderType::Teller,
            )
        );

        // Create institutions with processing data
        $institutionsWithProcessingData = $allInstitutions->map(
            fn ($institutionData) => [
                ...$institutionData->toArray(),
                'imageUrl' => "https://cdn.teller.io/web/images/banks/{$institutionData->id}.jpg",
                'folder' => 'banks',
            ]
        );

        // Add basic institution data to Meilisearch first
        $this->addInstitutionsToMeilisearch($allInstitutions);

        // Process in batches
        $this->dispatchInstitutionBatches($institutionsWithProcessingData);
    }

    /**
     * Fetch institutions from Teller API
     *
     * @return Collection<int, TellerInstitutionItemData>
     */
    private function fetchTellerInstitutions(): Collection
    {
        $response = Http::timeout(30)
            ->retry(3, 1000)
            ->get('https://api.teller.io/institutions');

        if (! $response->successful()) {
            Log::error('Teller API request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new Exception('Teller API request failed with status: '.$response->status());
        }

        return TellerInstitutionItemData::collect((array) $response->json(), Collection::class);
    }

    /**
     * Add institutions to Meilisearch
     *
     * @param  Collection<int, InstitutionSearchData>  $institutions
     */
    private function addInstitutionsToMeilisearch(Collection $institutions): void
    {
        try {
            $this->meilisearch->addDocuments('institutions', $institutions->toArray(), ['popularity']);
            $this->info('Added '.$institutions->count().' institutions to Meilisearch (without logos)');
        } catch (Exception $e) {
            Log::error('Failed to add institutions to Meilisearch', [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Dispatch institution batches for processing
     *
     * @param  Collection<int, non-empty-array<mixed>>  $institutions
     */
    private function dispatchInstitutionBatches(Collection $institutions): void
    {
        $totalInstitutions = $institutions->count();
        $batches = $institutions->chunk(self::BATCH_SIZE);
        $batchCount = $batches->count();

        $this->info("Dispatching {$totalInstitutions} institutions in {$batchCount} batches to jobs");

        $batches->each(function ($batch, $index) use ($batchCount): void {
            /** @var array<int, array<string, mixed>> $typedBatch */
            $typedBatch = $batch->toArray();
            ProcessInstitutionLogos::dispatch($typedBatch);

            $batchNumber = $index + 1;
            $this->info("Dispatched batch {$batchNumber} of {$batchCount} with ".count($batch).' institutions');
        });
    }

    /**
     * Get popularity score for an institution based on priority list
     */
    private function getPopularity(string $id): int
    {
        return in_array($id, self::PRIORITY_INSTITUTIONS)
            ? 100 - array_search($id, self::PRIORITY_INSTITUTIONS, true)
            : 10; // Base popularity for Teller institutions
    }
}
