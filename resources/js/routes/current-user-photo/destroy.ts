import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\ProfilePhotoController::destroy
 * @see app/Http/Controllers/ProfilePhotoController.php:16
 * @route /user/profile-photo
 */
export const destroy = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ['delete'],
    url: '\/user\/profile-photo',
}

/**
 * @see \App\Http\Controllers\ProfilePhotoController::destroy
 * @see app/Http/Controllers/ProfilePhotoController.php:16
 * @route /user/profile-photo
 */
destroy.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return destroy.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\ProfilePhotoController::destroy
 * @see app/Http/Controllers/ProfilePhotoController.php:16
 * @route /user/profile-photo
 */
destroy.delete = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(options),
    method: 'delete',
})

export default destroy