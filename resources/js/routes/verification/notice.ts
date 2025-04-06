import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::notice
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
 * @route /email/verify
 */
export const notice = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: notice.url(options),
    method: 'get',
})

notice.definition = {
    methods: ['get','head'],
    url: '\/email\/verify',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::notice
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
 * @route /email/verify
 */
notice.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return notice.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::notice
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
 * @route /email/verify
 */
notice.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: notice.url(options),
    method: 'get',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::notice
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
 * @route /email/verify
 */
notice.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: notice.url(options),
    method: 'head',
})

export default notice