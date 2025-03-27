<?php

declare(strict_types=1);

use Carbon\CarbonInterface;

return [

    /*
     * Your models' namespace.
     */
    'models_namespace' => 'App\\Models',

    /*
     * When enabled, TimeSeries will process the projections on a queue.
     */
    'queue' => true,

    /*
     * The specific queue name used by TimeSeries.
     * Leave empty to use the default queue.
     */
    'queue_name' => '',

    /*
     * The first day of the week.
     */
    'beginning_of_the_week' => CarbonInterface::MONDAY,
];
