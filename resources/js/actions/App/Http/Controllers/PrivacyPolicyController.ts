import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \App\Http\Controllers\PrivacyPolicyController::show
 * @see app/Http/Controllers/PrivacyPolicyController.php:16
 * @route /privacy-policy
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
    url: '\/privacy-policy',
}

/**
 * @see \App\Http\Controllers\PrivacyPolicyController::show
 * @see app/Http/Controllers/PrivacyPolicyController.php:16
 * @route /privacy-policy
 */
show.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return show.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\PrivacyPolicyController::show
 * @see app/Http/Controllers/PrivacyPolicyController.php:16
 * @route /privacy-policy
 */
show.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\PrivacyPolicyController::show
 * @see app/Http/Controllers/PrivacyPolicyController.php:16
 * @route /privacy-policy
 */
show.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: show.url(options),
    method: 'head',
})

const PrivacyPolicyController = { show }

export default PrivacyPolicyController