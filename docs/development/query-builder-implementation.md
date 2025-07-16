# QueryBuilder Implementation for Account API

## Overview

The Account API has been enhanced to use Laravel Query Builder (spatie/laravel-query-builder) for flexible, efficient, and standardized query operations. This implementation provides a clean, consistent approach to filtering, sorting, and including related data.

## Key Benefits

### 1. Standardized Query Interface
- Consistent parameter naming across all endpoints
- Automatic validation of allowed filters and sorts
- Built-in support for includes and relationships

### 2. Performance Optimization
- Efficient query building with proper indexing
- Reduced N+1 query problems through controlled includes
- Optimized caching strategy

### 3. Developer Experience
- Self-documenting API through allowed filters/sorts
- Reduced boilerplate code
- Type-safe query building

## Implementation Details

### Controller Usage

```php
// Basic QueryBuilder usage in AccountController
$accounts = QueryBuilder::for(Account::class)
    ->where('workspace_id', $workspaceId)
    ->allowedFilters([
        AllowedFilter::partial('name'),
        AllowedFilter::exact('currency_code'),
        AllowedFilter::exact('is_default'),
        AllowedFilter::callback('type', function ($query, $value) {
            $modelClass = $this->getModelClassFromType($value);
            $query->where('accountable_type', $modelClass);
        }),
        AllowedFilter::callback('balance_min', function ($query, $value) {
            $query->where('current_balance', '>=', $value);
        }),
        // ... more filters
    ])
    ->allowedSorts([
        'name', '-name', 
        'created_at', '-created_at',
        'current_balance', '-current_balance',
        'currency_code', '-currency_code'
    ])
    ->allowedIncludes(['bankConnection', 'accountable'])
    ->defaultSort('-created_at')
    ->paginate($perPage)
    ->withQueryString();
```

### Available Filters

#### Exact Filters
- `currency_code` - Filter by currency code (e.g., `?filter[currency_code]=USD`)
- `is_default` - Filter by default account status (e.g., `?filter[is_default]=true`)
- `is_manual` - Filter by manual account type (e.g., `?filter[is_manual]=false`)

#### Partial Filters
- `name` - Search by account name (e.g., `?filter[name]=Savings`)

#### Callback Filters
- `type` - Filter by account type (e.g., `?filter[type]=depository`)
- `balance_min` - Minimum balance filter (e.g., `?filter[balance_min]=1000`)
- `balance_max` - Maximum balance filter (e.g., `?filter[balance_max]=5000`)
- `created_from` - Created after date (e.g., `?filter[created_from]=2023-01-01`)
- `created_to` - Created before date (e.g., `?filter[created_to]=2023-12-31`)
- `search` - General search across account names (e.g., `?filter[search]=checking`)

### Available Sorts

- `name` / `-name` - Sort by account name (ascending/descending)
- `created_at` / `-created_at` - Sort by creation date
- `current_balance` / `-current_balance` - Sort by current balance
- `currency_code` / `-currency_code` - Sort by currency code
- `is_default` / `-is_default` - Sort by default status

### Available Includes

- `bankConnection` - Include bank connection details
- `accountable` - Include polymorphic account type details (Depository, CreditCard, etc.)

## API Usage Examples

### Basic Filtering
```http
GET /api/accounts?filter[currency_code]=USD&filter[is_default]=true
```

### Advanced Filtering with Sorting
```http
GET /api/accounts?filter[type]=depository&filter[balance_min]=1000&sort=-current_balance
```

### Including Related Data
```http
GET /api/accounts?include=bankConnection,accountable&sort=name
```

### Combined Example
```http
GET /api/accounts?filter[search]=savings&filter[currency_code]=USD&include=accountable&sort=-created_at&per_page=25
```

## Caching Integration

### Cache Key Generation
```php
private function generateCacheKey(Request $request, int $workspaceId): string
{
    $params = $request->query();
    ksort($params);
    return 'accounts:query:' . $workspaceId . ':' . md5(serialize($params));
}
```

### Cache Usage Pattern
```php
// Try cache first
$cacheKey = $this->generateCacheKey($request, $workspaceId);
$cachedResult = $this->cacheService->getCachedQuery($cacheKey);
if ($cachedResult) {
    return $cachedResult;
}

// Build query with QueryBuilder
$accounts = QueryBuilder::for(Account::class)
    // ... query building
    ->paginate($perPage);

// Cache the result
$result = AccountResource::collection($accounts);
$this->cacheService->cacheQuery($cacheKey, $result);
```

## Account Type Mapping

The `type` filter uses a mapping function to convert user-friendly type names to model classes:

```php
private function getModelClassFromType(string $type): string
{
    return match ($type) {
        'depository' => 'App\\Models\\Depository',
        'credit_card' => 'App\\Models\\CreditCard',
        'loan' => 'App\\Models\\Loan',
        'investment' => 'App\\Models\\Investment',
        'crypto' => 'App\\Models\\Crypto',
        'other_asset' => 'App\\Models\\OtherAsset',
        'other_liability' => 'App\\Models\\OtherLiability',
        default => 'App\\Models\\Depository',
    };
}
```

## Validation Integration

QueryBuilder works seamlessly with existing validation:

```php
// In AccountValidationRules trait
$query = QueryBuilder::for(Account::class)
    ->where('workspace_id', $workspaceId)
    ->where('name', $value);

// Exclude current account for updates
if ($this->route('account') instanceof Account) {
    $query->where('id', '!=', $this->route('account')->id);
}
```

## Bulk Operations

QueryBuilder is also used in bulk operations for consistency:

```php
// Bulk account retrieval
$accounts = QueryBuilder::for(Account::class)
    ->where('workspace_id', $workspaceId)
    ->with(['accountable', 'bankConnection'])
    ->when(!empty($accountIds), function ($query) use ($accountIds) {
        $query->whereIn('public_id', $accountIds);
    })
    ->get();
```

## Performance Considerations

### Database Indexes
The following indexes support QueryBuilder operations:
- `accounts_workspace_id_index`
- `accounts_workspace_id_currency_code_index`
- `accounts_workspace_id_is_default_index`
- `accounts_workspace_id_accountable_type_index`
- `accounts_workspace_id_created_at_index`

### Query Optimization
- Use `allowedIncludes` to prevent N+1 queries
- Implement proper caching for frequently accessed data
- Use `defaultSort` to ensure consistent ordering
- Limit `per_page` to prevent memory issues

## Testing

QueryBuilder implementation includes comprehensive tests:

```php
// Example test for filtering
public function test_can_filter_accounts_by_type(): void
{
    $response = $this->getJson('/api/accounts?filter[type]=depository');
    
    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'type']
            ]
        ]);
}
```

## Best Practices

1. **Always use workspace scoping** - Every query should filter by workspace_id
2. **Implement proper caching** - Cache query results with appropriate TTL
3. **Use type-safe filters** - Validate filter values before applying
4. **Limit includes** - Only allow necessary relationships to prevent data leakage
5. **Set reasonable defaults** - Use defaultSort and limit pagination
6. **Handle errors gracefully** - Wrap QueryBuilder calls in try-catch blocks

## Migration from Manual Queries

When migrating from manual query building to QueryBuilder:

1. Replace `->where()` chains with `allowedFilters`
2. Replace manual sorting with `allowedSorts`
3. Replace manual includes with `allowedIncludes`
4. Update cache keys to use request parameters
5. Update tests to use QueryBuilder parameter format

## Future Enhancements

- Add support for more complex filters (date ranges, multiple values)
- Implement query result caching at the database level
- Add support for aggregation queries
- Implement query performance monitoring
- Add support for GraphQL-style field selection