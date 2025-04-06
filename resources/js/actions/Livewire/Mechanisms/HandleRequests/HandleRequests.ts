import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \Livewire\Mechanisms\HandleRequests\HandleRequests::handleUpdate
 * @see vendor/livewire/livewire/src/Mechanisms/HandleRequests/HandleRequests.php:79
 * @route /livewire/update
 */
export const handleUpdate = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: handleUpdate.url(options),
    method: 'post',
})

handleUpdate.definition = {
    methods: ['post'],
    url: '\/livewire\/update',
}

/**
 * @see \Livewire\Mechanisms\HandleRequests\HandleRequests::handleUpdate
 * @see vendor/livewire/livewire/src/Mechanisms/HandleRequests/HandleRequests.php:79
 * @route /livewire/update
 */
handleUpdate.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return handleUpdate.definition.url + queryParams(options)
}

/**
 * @see \Livewire\Mechanisms\HandleRequests\HandleRequests::handleUpdate
 * @see vendor/livewire/livewire/src/Mechanisms/HandleRequests/HandleRequests.php:79
 * @route /livewire/update
 */
handleUpdate.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: handleUpdate.url(options),
    method: 'post',
})

const HandleRequests = { handleUpdate }

export default HandleRequests