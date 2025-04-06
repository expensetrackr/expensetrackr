import { queryParams, type QueryParams } from './../../../../../../wayfinder'

/**
 * @see \Filament\Actions\Imports\Http\Controllers\DownloadImportFailureCsv::DownloadImportFailureCsv
 * @see vendor/filament/actions/src/Imports/Http/Controllers/DownloadImportFailureCsv.php:17
 * @route /filament/imports/{import}/failed-rows/download
 */
const DownloadImportFailureCsv = (args: { import: string | number | { id: string | number } } | [import: string | number | { id: string | number }] | string | number | { id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: DownloadImportFailureCsv.url(args, options),
    method: 'get',
})

DownloadImportFailureCsv.definition = {
    methods: ['get','head'],
    url: '\/filament\/imports\/{import}\/failed-rows\/download',
}

/**
 * @see \Filament\Actions\Imports\Http\Controllers\DownloadImportFailureCsv::DownloadImportFailureCsv
 * @see vendor/filament/actions/src/Imports/Http/Controllers/DownloadImportFailureCsv.php:17
 * @route /filament/imports/{import}/failed-rows/download
 */
DownloadImportFailureCsv.url = (args: { import: string | number | { id: string | number } } | [import: string | number | { id: string | number }] | string | number | { id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { import: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { import: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            import: args[0],
        }
    }

    const parsedArgs = {
        import: typeof args.import === 'object'
            ? args.import.id
            : args.import,
    }

    return DownloadImportFailureCsv.definition.url
            .replace('{import}', parsedArgs.import.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \Filament\Actions\Imports\Http\Controllers\DownloadImportFailureCsv::DownloadImportFailureCsv
 * @see vendor/filament/actions/src/Imports/Http/Controllers/DownloadImportFailureCsv.php:17
 * @route /filament/imports/{import}/failed-rows/download
 */
DownloadImportFailureCsv.get = (args: { import: string | number | { id: string | number } } | [import: string | number | { id: string | number }] | string | number | { id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: DownloadImportFailureCsv.url(args, options),
    method: 'get',
})

/**
 * @see \Filament\Actions\Imports\Http\Controllers\DownloadImportFailureCsv::DownloadImportFailureCsv
 * @see vendor/filament/actions/src/Imports/Http/Controllers/DownloadImportFailureCsv.php:17
 * @route /filament/imports/{import}/failed-rows/download
 */
DownloadImportFailureCsv.head = (args: { import: string | number | { id: string | number } } | [import: string | number | { id: string | number }] | string | number | { id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: DownloadImportFailureCsv.url(args, options),
    method: 'head',
})

export default DownloadImportFailureCsv