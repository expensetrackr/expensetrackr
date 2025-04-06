import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \App\Http\Controllers\TermsOfServiceController::show
 * @see app/Http/Controllers/TermsOfServiceController.php:16
 * @route /terms-of-service
 */
export const show = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ['get','head'],
    url: '\/terms-of-service',
}

/**
 * @see \App\Http\Controllers\TermsOfServiceController::show
 * @see app/Http/Controllers/TermsOfServiceController.php:16
 * @route /terms-of-service
 */
show.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return show.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\TermsOfServiceController::show
 * @see app/Http/Controllers/TermsOfServiceController.php:16
 * @route /terms-of-service
 */
show.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\TermsOfServiceController::show
 * @see app/Http/Controllers/TermsOfServiceController.php:16
 * @route /terms-of-service
 */
show.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: show.url(options),
    method: 'head',
})

const TermsOfServiceController = { show }

export default TermsOfServiceController