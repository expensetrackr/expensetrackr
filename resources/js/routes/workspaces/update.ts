import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\WorkspaceController::update
 * @see app/Http/Controllers/WorkspaceController.php:80
 * @route /workspaces/{workspace}
 */
export const update = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ['put'],
    url: '\/workspaces\/{workspace}',
}

/**
 * @see \App\Http\Controllers\WorkspaceController::update
 * @see app/Http/Controllers/WorkspaceController.php:80
 * @route /workspaces/{workspace}
 */
update.url = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return update.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceController::update
 * @see app/Http/Controllers/WorkspaceController.php:80
 * @route /workspaces/{workspace}
 */
update.put = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

export default update