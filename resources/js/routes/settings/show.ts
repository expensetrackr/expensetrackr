import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see routes/web.php:47
 * @route /settings
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
    url: '\/settings',
}

/**
 * @see routes/web.php:47
 * @route /settings
 */
show.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return show.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:47
 * @route /settings
 */
show.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(options),
    method: 'get',
})

/**
 * @see routes/web.php:47
 * @route /settings
 */
show.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: show.url(options),
    method: 'head',
})

export default show