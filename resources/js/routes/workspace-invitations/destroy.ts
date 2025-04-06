import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\WorkspaceInvitationController::destroy
 * @see app/Http/Controllers/WorkspaceInvitationController.php:47
 * @route /workspace-invitations/{invitation}
 */
export const destroy = (args: { invitation: string | { id: string } } | [invitation: string | { id: string }] | string | { id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ['delete'],
    url: '\/workspace-invitations\/{invitation}',
}

/**
 * @see \App\Http\Controllers\WorkspaceInvitationController::destroy
 * @see app/Http/Controllers/WorkspaceInvitationController.php:47
 * @route /workspace-invitations/{invitation}
 */
destroy.url = (args: { invitation: string | { id: string } } | [invitation: string | { id: string }] | string | { id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invitation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invitation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            invitation: args[0],
        }
    }

    const parsedArgs = {
        invitation: typeof args.invitation === 'object'
            ? args.invitation.id
            : args.invitation,
    }

    return destroy.definition.url
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceInvitationController::destroy
 * @see app/Http/Controllers/WorkspaceInvitationController.php:47
 * @route /workspace-invitations/{invitation}
 */
destroy.delete = (args: { invitation: string | { id: string } } | [invitation: string | { id: string }] | string | { id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

export default destroy