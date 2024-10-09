<?php

declare(strict_types=1);

namespace Workspaces;

trait InteractsWithBanner
{
    /**
     * Update the banner message.
     */
    protected function banner(string $message): void
    {
        $this->dispatch('banner-message',
            style: 'success',
            message: $message,
        );
    }

    /**
     * Update the banner message with a warning message.
     */
    protected function warningBanner(string $message): void
    {
        $this->dispatch('banner-message',
            style: 'warning',
            message: $message,
        );
    }

    /**
     * Update the banner message with a danger / error message.
     */
    protected function dangerBanner(string $message): void
    {
        $this->dispatch('banner-message',
            style: 'danger',
            message: $message,
        );
    }
}
