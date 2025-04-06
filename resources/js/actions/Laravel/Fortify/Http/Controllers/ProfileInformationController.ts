import { queryParams, type QueryParams } from './../../../../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\ProfileInformationController::update
 * @see vendor/laravel/fortify/src/Http/Controllers/ProfileInformationController.php:21
 * @route /user/profile-information
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
    url: '\/user\/profile-information',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\ProfileInformationController::update
 * @see vendor/laravel/fortify/src/Http/Controllers/ProfileInformationController.php:21
 * @route /user/profile-information
 */
update.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return update.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\ProfileInformationController::update
 * @see vendor/laravel/fortify/src/Http/Controllers/ProfileInformationController.php:21
 * @route /user/profile-information
 */
update.put = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(options),
    method: 'put',
})

const ProfileInformationController = { update }

export default ProfileInformationController