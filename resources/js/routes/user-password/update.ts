import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordController::update
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordController.php:20
 * @route /user/password
 */
export const update = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ['put'],
    url: '\/user\/password',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordController::update
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordController.php:20
 * @route /user/password
 */
update.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return update.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordController::update
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordController.php:20
 * @route /user/password
 */
update.put = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(options),
    method: 'put',
})

export default update