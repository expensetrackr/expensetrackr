import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \App\Http\Controllers\PrivacyAndSecurityController::show
 * @see app/Http/Controllers/PrivacyAndSecurityController.php:22
 * @route /settings/privacy-and-security
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
    url: '\/settings\/privacy-and-security',
}

/**
 * @see \App\Http\Controllers\PrivacyAndSecurityController::show
 * @see app/Http/Controllers/PrivacyAndSecurityController.php:22
 * @route /settings/privacy-and-security
 */
show.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return show.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\PrivacyAndSecurityController::show
 * @see app/Http/Controllers/PrivacyAndSecurityController.php:22
 * @route /settings/privacy-and-security
 */
show.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\PrivacyAndSecurityController::show
 * @see app/Http/Controllers/PrivacyAndSecurityController.php:22
 * @route /settings/privacy-and-security
 */
show.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: show.url(options),
    method: 'head',
})

const PrivacyAndSecurityController = { show }

export default PrivacyAndSecurityController