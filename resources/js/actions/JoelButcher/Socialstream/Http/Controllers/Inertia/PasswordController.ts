import { queryParams, type QueryParams } from './../../../../../../wayfinder'

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\Inertia\PasswordController::store
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/Inertia/PasswordController.php:16
 * @route /user/set-password
 */
export const store = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ['post'],
    url: '\/user\/set-password',
}

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\Inertia\PasswordController::store
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/Inertia/PasswordController.php:16
 * @route /user/set-password
 */
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\Inertia\PasswordController::store
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/Inertia/PasswordController.php:16
 * @route /user/set-password
 */
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

const PasswordController = { store }

export default PasswordController