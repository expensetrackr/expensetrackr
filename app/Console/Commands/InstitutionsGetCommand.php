<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Data\SearchableInstitutionData;
use App\Data\TellerInstitutionItemData;
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

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->getTellerInstitutions();
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
