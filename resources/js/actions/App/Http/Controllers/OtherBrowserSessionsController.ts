import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \App\Http\Controllers\OtherBrowserSessionsController::destroy
 * @see app/Http/Controllers/OtherBrowserSessionsController.php:23
 * @route /user/other-browser-sessions
 */
export const destroy = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ['delete'],
    url: '\/user\/other-browser-sessions',
}

/**
 * @see \App\Http\Controllers\OtherBrowserSessionsController::destroy
 * @see app/Http/Controllers/OtherBrowserSessionsController.php:23
 * @route /user/other-browser-sessions
 */
destroy.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return destroy.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\OtherBrowserSessionsController::destroy
 * @see app/Http/Controllers/OtherBrowserSessionsController.php:23
 * @route /user/other-browser-sessions
 */
destroy.delete = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(options),
    method: 'delete',
})

const OtherBrowserSessionsController = { destroy }

export default OtherBrowserSessionsController