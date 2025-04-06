import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\WorkspaceInvitationController::accept
 * @see app/Http/Controllers/WorkspaceInvitationController.php:19
 * @route /workspace-invitations/{invitation}
 */
export const accept = (args: { invitation: string | { id: string } } | [invitation: string | { id: string }] | string | { id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: accept.url(args, options),
    method: 'get',
})

accept.definition = {
    methods: ['get','head'],
    url: '\/workspace-invitations\/{invitation}',
}

/**
 * @see \App\Http\Controllers\WorkspaceInvitationController::accept
 * @see app/Http/Controllers/WorkspaceInvitationController.php:19
 * @route /workspace-invitations/{invitation}
 */
accept.url = (args: { invitation: string | { id: string } } | [invitation: string | { id: string }] | string | { id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return accept.definition.url
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceInvitationController::accept
 * @see app/Http/Controllers/WorkspaceInvitationController.php:19
 * @route /workspace-invitations/{invitation}
 */
accept.get = (args: { invitation: string | { id: string } } | [invitation: string | { id: string }] | string | { id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: accept.url(args, options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\WorkspaceInvitationController::accept
 * @see app/Http/Controllers/WorkspaceInvitationController.php:19
 * @route /workspace-invitations/{invitation}
 */
accept.head = (args: { invitation: string | { id: string } } | [invitation: string | { id: string }] | string | { id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: accept.url(args, options),
    method: 'head',
})

export default accept