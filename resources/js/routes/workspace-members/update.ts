import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::update
 * @see app/Http/Controllers/WorkspaceMemberController.php:44
 * @route /workspaces/{workspace}/members/{user}
 */
export const update = (args: { workspace: string | { public_id: string }, user: string | number } | [workspace: string | { public_id: string }, user: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ['put'],
    url: '\/workspaces\/{workspace}\/members\/{user}',
}

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::update
 * @see app/Http/Controllers/WorkspaceMemberController.php:44
 * @route /workspaces/{workspace}/members/{user}
 */
update.url = (args: { workspace: string | { public_id: string }, user: string | number } | [workspace: string | { public_id: string }, user: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return update.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::update
 * @see app/Http/Controllers/WorkspaceMemberController.php:44
 * @route /workspaces/{workspace}/members/{user}
 */
update.put = (args: { workspace: string | { public_id: string }, user: string | number } | [workspace: string | { public_id: string }, user: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

export default update