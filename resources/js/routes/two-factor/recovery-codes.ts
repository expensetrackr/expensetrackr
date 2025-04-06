import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\RecoveryCodeController::recoveryCodes
 * @see vendor/laravel/fortify/src/Http/Controllers/RecoveryCodeController.php:18
 * @route /user/two-factor-recovery-codes
 */
export const recoveryCodes = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: recoveryCodes.url(options),
    method: 'get',
})

recoveryCodes.definition = {
    methods: ['get','head'],
    url: '\/user\/two-factor-recovery-codes',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\RecoveryCodeController::recoveryCodes
 * @see vendor/laravel/fortify/src/Http/Controllers/RecoveryCodeController.php:18
 * @route /user/two-factor-recovery-codes
 */
recoveryCodes.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return recoveryCodes.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\RecoveryCodeController::recoveryCodes
 * @see vendor/laravel/fortify/src/Http/Controllers/RecoveryCodeController.php:18
 * @route /user/two-factor-recovery-codes
 */
recoveryCodes.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: recoveryCodes.url(options),
    method: 'get',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\RecoveryCodeController::recoveryCodes
 * @see vendor/laravel/fortify/src/Http/Controllers/RecoveryCodeController.php:18
 * @route /user/two-factor-recovery-codes
 */
recoveryCodes.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: recoveryCodes.url(options),
    method: 'head',
})

export default recoveryCodes