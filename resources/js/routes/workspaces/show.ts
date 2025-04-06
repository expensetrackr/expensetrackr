import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\WorkspaceController::show
 * @see app/Http/Controllers/WorkspaceController.php:34
 * @route /workspaces/{workspace}
 */
export const show = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ['get','head'],
    url: '\/workspaces\/{workspace}',
}

/**
 * @see \App\Http\Controllers\WorkspaceController::show
 * @see app/Http/Controllers/WorkspaceController.php:34
 * @route /workspaces/{workspace}
 */
show.url = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return show.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceController::show
 * @see app/Http/Controllers/WorkspaceController.php:34
 * @route /workspaces/{workspace}
 */
show.get = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(args, options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\WorkspaceController::show
 * @see app/Http/Controllers/WorkspaceController.php:34
 * @route /workspaces/{workspace}
 */
show.head = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: show.url(args, options),
    method: 'head',
})

export default show