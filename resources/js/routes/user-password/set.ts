import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\Inertia\PasswordController::set
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/Inertia/PasswordController.php:16
 * @route /user/set-password
 */
export const set = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: set.url(options),
    method: 'post',
})

set.definition = {
    methods: ['post'],
    url: '\/user\/set-password',
}

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\Inertia\PasswordController::set
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/Inertia/PasswordController.php:16
 * @route /user/set-password
 */
set.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return set.definition.url + queryParams(options)
}

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\Inertia\PasswordController::set
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/Inertia/PasswordController.php:16
 * @route /user/set-password
 */
set.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: set.url(options),
    method: 'post',
})

export default set