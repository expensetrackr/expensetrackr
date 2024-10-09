<?php

declare(strict_types=1);

use Workspaces\Features;

return [
    'middleware' => ['web'],
    'features' => [Features::accountDeletion()],
    'profile_photo_disk' => 'public',
];
