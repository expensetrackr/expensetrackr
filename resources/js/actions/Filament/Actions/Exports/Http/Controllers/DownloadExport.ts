import { queryParams, type QueryParams } from './../../../../../../wayfinder'

/**
 * @see \Filament\Actions\Exports\Http\Controllers\DownloadExport::DownloadExport
 * @see vendor/filament/actions/src/Exports/Http/Controllers/DownloadExport.php:16
 * @route /filament/exports/{export}/download
 */
const DownloadExport = (args: { export: string | number | { id: string | number } } | [export: string | number | { id: string | number }] | string | number | { id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: DownloadExport.url(args, options),
    method: 'get',
})

DownloadExport.definition = {
    methods: ['get','head'],
    url: '\/filament\/exports\/{export}\/download',
}

/**
 * @see \Filament\Actions\Exports\Http\Controllers\DownloadExport::DownloadExport
 * @see vendor/filament/actions/src/Exports/Http/Controllers/DownloadExport.php:16
 * @route /filament/exports/{export}/download
 */
DownloadExport.url = (args: { export: string | number | { id: string | number } } | [export: string | number | { id: string | number }] | string | number | { id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { export: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { export: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            export: args[0],
        }
    }

    const parsedArgs = {
        export: typeof args.export === 'object'
            ? args.export.id
            : args.export,
    }

    return DownloadExport.definition.url
            .replace('{export}', parsedArgs.export.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \Filament\Actions\Exports\Http\Controllers\DownloadExport::DownloadExport
 * @see vendor/filament/actions/src/Exports/Http/Controllers/DownloadExport.php:16
 * @route /filament/exports/{export}/download
 */
DownloadExport.get = (args: { export: string | number | { id: string | number } } | [export: string | number | { id: string | number }] | string | number | { id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: DownloadExport.url(args, options),
    method: 'get',
})

/**
 * @see \Filament\Actions\Exports\Http\Controllers\DownloadExport::DownloadExport
 * @see vendor/filament/actions/src/Exports/Http/Controllers/DownloadExport.php:16
 * @route /filament/exports/{export}/download
 */
DownloadExport.head = (args: { export: string | number | { id: string | number } } | [export: string | number | { id: string | number }] | string | number | { id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: DownloadExport.url(args, options),
    method: 'head',
})

export default DownloadExport