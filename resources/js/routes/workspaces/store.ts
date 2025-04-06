import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\WorkspaceController::store
 * @see app/Http/Controllers/WorkspaceController.php:56
 * @route /workspaces
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
    url: '\/workspaces',
}

/**
 * @see \App\Http\Controllers\WorkspaceController::store
 * @see app/Http/Controllers/WorkspaceController.php:56
 * @route /workspaces
 */
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceController::store
 * @see app/Http/Controllers/WorkspaceController.php:56
 * @route /workspaces
 */
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

export default store