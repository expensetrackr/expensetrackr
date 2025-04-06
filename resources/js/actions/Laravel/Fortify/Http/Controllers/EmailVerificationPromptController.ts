import { queryParams, type QueryParams } from './../../../../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::__invoke
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
 * @route /email/verify
 */
export const __invoke = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: __invoke.url(options),
    method: 'get',
})

__invoke.definition = {
    methods: ['get','head'],
    url: '\/email\/verify',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::__invoke
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
 * @route /email/verify
 */
__invoke.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return __invoke.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::__invoke
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
 * @route /email/verify
 */
__invoke.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: __invoke.url(options),
    method: 'get',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::__invoke
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
 * @route /email/verify
 */
__invoke.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: __invoke.url(options),
    method: 'head',
})

const EmailVerificationPromptController = { __invoke }

export default EmailVerificationPromptController