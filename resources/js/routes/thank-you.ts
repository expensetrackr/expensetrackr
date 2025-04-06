import { queryParams, type QueryParams } from './../wayfinder'

/**
 * @see routes/web.php:56
 * @route /thank-you
 */
export const thankYou = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: thankYou.url(options),
    method: 'get',
})

thankYou.definition = {
    methods: ['get','head'],
    url: '\/thank-you',
}

/**
 * @see routes/web.php:56
 * @route /thank-you
 */
thankYou.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return thankYou.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:56
 * @route /thank-you
 */
thankYou.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: thankYou.url(options),
    method: 'get',
})

/**
 * @see routes/web.php:56
 * @route /thank-you
 */
thankYou.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: thankYou.url(options),
    method: 'head',
})

export default thankYou