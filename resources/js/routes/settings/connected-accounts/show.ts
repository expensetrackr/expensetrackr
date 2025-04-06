import { queryParams, type QueryParams } from './../../../wayfinder'

/**
 * @see routes/web.php:50
 * @route /settings/connected-accounts
 */
export const show = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ['get','head'],
    url: '\/settings\/connected-accounts',
}

/**
 * @see routes/web.php:50
 * @route /settings/connected-accounts
 */
show.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return show.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:50
 * @route /settings/connected-accounts
 */
show.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(options),
    method: 'get',
})

/**
 * @see routes/web.php:50
 * @route /settings/connected-accounts
 */
show.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: show.url(options),
    method: 'head',
})

export default show