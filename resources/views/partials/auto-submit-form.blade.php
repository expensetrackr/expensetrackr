<script>
    // Create a MutationObserver to watch for new elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    // Element node
                    // Check the added element and its children for data-auto-submit
                    const elements = [
                        ...(node.hasAttribute('data-auto-submit') ? [node] : []),
                        ...node.querySelectorAll('[data-auto-submit]'),
                    ];

                    elements.forEach(setupAutoSubmit);
                }
            });
        });
    });

    function setupAutoSubmit(element) {
        if (element.dataset.autoSubmitInitialized) return;

        const form = element.closest('form');
        if (!form) return;

        const triggerEvent = getTriggerEvent(element);

        let timeout;
        let isSubmitting = false;

        // Setup value change observer for hidden inputs
        if (element.type === 'hidden') {
            const valueObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                        handleInput();
                    }
                });
            });

            valueObserver.observe(element, {
                attributes: true,
                attributeFilter: ['value'],
            });

            // Store the observer for cleanup
            element._valueObserver = valueObserver;
        }

        const handleInput = (event) => {
            if (isSubmitting) return;

            clearTimeout(timeout);
            timeout = setTimeout(() => {
                isSubmitting = true;

                // Trigger appropriate event based on element type
                const eventType =
                    element.type === 'checkbox' || element.getAttribute('role') === 'switch' ? 'change' : 'input';

                try {
                    const inputEvent = new InputEvent(eventType, {
                        bubbles: true,
                        cancelable: true,
                    });
                    element.dispatchEvent(inputEvent);
                } catch (e) {
                    const fallbackEvent = new Event(eventType, {
                        bubbles: true,
                        cancelable: true,
                    });
                    element.dispatchEvent(fallbackEvent);
                }

                setTimeout(() => {
                    // Cross-browser form submission
                    if (typeof form.requestSubmit === 'function') {
                        // Modern browsers
                        form.requestSubmit();
                    } else {
                        // Fallback for Firefox and older browsers
                        const submitButton =
                            form.querySelector('button[type="submit"]') || form.querySelector('input[type="submit"]');

                        if (submitButton) {
                            submitButton.click();
                        } else {
                            // Last resort: create and trigger submit event
                            const submitEvent = new Event('submit', {
                                bubbles: true,
                                cancelable: true,
                            });
                            form.dispatchEvent(submitEvent);
                        }
                    }

                    setTimeout(() => {
                        if (shouldRestoreFocus(element)) {
                            element.focus();
                            if (typeof element.setSelectionRange === 'function') {
                                const cursorPosition = element.selectionStart;
                                element.setSelectionRange(cursorPosition, cursorPosition);
                            }
                        }
                        isSubmitting = false;
                    }, 100);
                }, 50);
            }, getDebounceTimeout(element));
        };

        element.addEventListener(triggerEvent, handleInput);
        element.dataset.autoSubmitInitialized = 'true';

        element._autoSubmitCleanup = () => {
            element.removeEventListener(triggerEvent, handleInput);
            if (element._valueObserver) {
                element._valueObserver.disconnect();
            }
            clearTimeout(timeout);
        };
    }

    function getTriggerEvent(element) {
        if (element.dataset.autosubmitTriggerEvent) {
            return element.dataset.autosubmitTriggerEvent;
        }

        // Default events based on element type
        if (
            element.getAttribute('role') === 'switch' ||
            element.type === 'checkbox' ||
            element.type === 'radio' ||
            element.tagName.toLowerCase() === 'select'
        ) {
            return 'click';
        }

        return 'input';
    }

    function shouldRestoreFocus(element) {
        const tagName = element.tagName.toLowerCase();
        const type = element.type || '';

        // Only restore focus for text input elements
        return (
            (tagName === 'input' && ['text', 'search', 'email', 'tel', 'url', 'password'].includes(type)) ||
            tagName === 'textarea'
        );
    }

    function getDebounceTimeout(element) {
        if (element.dataset.autosubmitDebounceTimeout) {
            return Number.parseInt(element.dataset.autosubmitDebounceTimeout);
        }

        const type = element.type || element.tagName;
        const role = element.getAttribute('role');

        // Immediate submission for switches, checkboxes, radios, and selects
        if (
            role === 'switch' ||
            type === 'checkbox' ||
            type === 'radio' ||
            type.toLowerCase() === 'select-one' ||
            type.toLowerCase() === 'select-multiple'
        ) {
            return 0;
        }

        // Default debounce for text inputs
        return 500;
    }

    // Start observing when the document is ready
    document.addEventListener('DOMContentLoaded', function () {
        // Observe the entire document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Initial setup for any existing elements
        document.querySelectorAll('[data-auto-submit]').forEach(setupAutoSubmit);
    });

    // Cleanup when navigating away
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
        document.querySelectorAll('[data-auto-submit]').forEach((element) => {
            if (element._autoSubmitCleanup) {
                element._autoSubmitCleanup();
            }
        });
    });
</script>
