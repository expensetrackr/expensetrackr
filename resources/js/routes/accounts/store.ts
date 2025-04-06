import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\AccountController::store
 * @see app/Http/Controllers/AccountController.php:157
 * @route /accounts
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
    url: '\/accounts',
}

/**
 * @see \App\Http\Controllers\AccountController::store
 * @see app/Http/Controllers/AccountController.php:157
 * @route /accounts
 */
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\AccountController::store
 * @see app/Http/Controllers/AccountController.php:157
 * @route /accounts
 */
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

export default store