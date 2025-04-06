import { queryParams, type QueryParams } from './../../../wayfinder'

/**
 * @see \Filament\Actions\Exports\Http\Controllers\DownloadExport::download
 * @see vendor/filament/actions/src/Exports/Http/Controllers/DownloadExport.php:16
 * @route /filament/exports/{export}/download
 */
export const download = (args: { export: string | number | { id: string | number } } | [export: string | number | { id: string | number }] | string | number | { id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ['get','head'],
    url: '\/filament\/exports\/{export}\/download',
}

/**
 * @see \Filament\Actions\Exports\Http\Controllers\DownloadExport::download
 * @see vendor/filament/actions/src/Exports/Http/Controllers/DownloadExport.php:16
 * @route /filament/exports/{export}/download
 */
download.url = (args: { export: string | number | { id: string | number } } | [export: string | number | { id: string | number }] | string | number | { id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return download.definition.url
            .replace('{export}', parsedArgs.export.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \Filament\Actions\Exports\Http\Controllers\DownloadExport::download
 * @see vendor/filament/actions/src/Exports/Http/Controllers/DownloadExport.php:16
 * @route /filament/exports/{export}/download
 */
download.get = (args: { export: string | number | { id: string | number } } | [export: string | number | { id: string | number }] | string | number | { id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: download.url(args, options),
    method: 'get',
})

/**
 * @see \Filament\Actions\Exports\Http\Controllers\DownloadExport::download
 * @see vendor/filament/actions/src/Exports/Http/Controllers/DownloadExport.php:16
 * @route /filament/exports/{export}/download
 */
download.head = (args: { export: string | number | { id: string | number } } | [export: string | number | { id: string | number }] | string | number | { id: string | number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: download.url(args, options),
    method: 'head',
})

export default download