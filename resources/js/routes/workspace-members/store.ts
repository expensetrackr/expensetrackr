import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::store
 * @see app/Http/Controllers/WorkspaceMemberController.php:26
 * @route /workspaces/{workspace}/members
 */
export const store = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ['post'],
    url: '\/workspaces\/{workspace}\/members',
}

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::store
 * @see app/Http/Controllers/WorkspaceMemberController.php:26
 * @route /workspaces/{workspace}/members
 */
store.url = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workspace: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'public_id' in args) {
        args = { workspace: args.public_id }
    }

    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
        }
    }

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
            ? args.workspace.public_id
            : args.workspace,
    }

    return store.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::store
 * @see app/Http/Controllers/WorkspaceMemberController.php:26
 * @route /workspaces/{workspace}/members
 */
store.post = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(args, options),
    method: 'post',
})

export default store