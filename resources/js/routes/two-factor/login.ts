import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorAuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorAuthenticatedSessionController.php:42
 * @route /two-factor-challenge
 */
export const login = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ['get','head'],
    url: '\/two-factor-challenge',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorAuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorAuthenticatedSessionController.php:42
 * @route /two-factor-challenge
 */
login.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return login.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorAuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorAuthenticatedSessionController.php:42
 * @route /two-factor-challenge
 */
login.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: login.url(options),
    method: 'get',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorAuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorAuthenticatedSessionController.php:42
 * @route /two-factor-challenge
 */
login.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: login.url(options),
    method: 'head',
})

export default login