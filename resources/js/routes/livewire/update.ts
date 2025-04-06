import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Livewire\Mechanisms\HandleRequests\HandleRequests::update
 * @see vendor/livewire/livewire/src/Mechanisms/HandleRequests/HandleRequests.php:79
 * @route /livewire/update
 */
export const update = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ['post'],
    url: '\/livewire\/update',
}

/**
 * @see \Livewire\Mechanisms\HandleRequests\HandleRequests::update
 * @see vendor/livewire/livewire/src/Mechanisms/HandleRequests/HandleRequests.php:79
 * @route /livewire/update
 */
update.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return update.definition.url + queryParams(options)
}

/**
 * @see \Livewire\Mechanisms\HandleRequests\HandleRequests::update
 * @see vendor/livewire/livewire/src/Mechanisms/HandleRequests/HandleRequests.php:79
 * @route /livewire/update
 */
update.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: update.url(options),
    method: 'post',
})

export default update