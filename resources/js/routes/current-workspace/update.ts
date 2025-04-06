import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\CurrentWorkspaceController::update
 * @see app/Http/Controllers/CurrentWorkspaceController.php:16
 * @route /current-workspace
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
    url: '\/current-workspace',
}

/**
 * @see \App\Http\Controllers\CurrentWorkspaceController::update
 * @see app/Http/Controllers/CurrentWorkspaceController.php:16
 * @route /current-workspace
 */
update.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return update.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\CurrentWorkspaceController::update
 * @see app/Http/Controllers/CurrentWorkspaceController.php:16
 * @route /current-workspace
 */
update.put = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(options),
    method: 'put',
})

export default update