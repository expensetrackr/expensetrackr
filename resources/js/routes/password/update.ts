import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\NewPasswordController::update
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:55
 * @route /reset-password
 */
export const update = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ['post'],
    url: '\/reset-password',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\NewPasswordController::update
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:55
 * @route /reset-password
 */
update.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return update.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\NewPasswordController::update
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:55
 * @route /reset-password
 */
update.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: update.url(options),
    method: 'post',
})

export default update