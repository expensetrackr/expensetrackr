import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::destroy
 * @see app/Http/Controllers/WorkspaceMemberController.php:62
 * @route /workspaces/{workspace}/members/{user}
 */
export const destroy = (args: { workspace: string | { public_id: string }, user: string | number } | [workspace: string | { public_id: string }, user: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ['delete'],
    url: '\/workspaces\/{workspace}\/members\/{user}',
}

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::destroy
 * @see app/Http/Controllers/WorkspaceMemberController.php:62
 * @route /workspaces/{workspace}/members/{user}
 */
destroy.url = (args: { workspace: string | { public_id: string }, user: string | number } | [workspace: string | { public_id: string }, user: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
            user: args[1],
        }
    }

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
            ? args.workspace.public_id
            : args.workspace,
        user: args.user,
    }

    return destroy.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::destroy
 * @see app/Http/Controllers/WorkspaceMemberController.php:62
 * @route /workspaces/{workspace}/members/{user}
 */
destroy.delete = (args: { workspace: string | { public_id: string }, user: string | number } | [workspace: string | { public_id: string }, user: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

export default destroy