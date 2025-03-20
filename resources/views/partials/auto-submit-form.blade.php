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
        // Skip if already initialized
        if (element.dataset.autoSubmitInitialized) return;

        const form = element.closest('form');
        if (!form) return;

        // Determine the appropriate trigger event based on element type
        const triggerEvent = getTriggerEvent(element);

        let timeout;
        let isSubmitting = false;

        const handleInput = (event) => {
            // Prevent handling if this was triggered by our own submission
            if (isSubmitting) return;

            clearTimeout(timeout);
            timeout = setTimeout(() => {
                isSubmitting = true;

                // Trigger appropriate event based on element type
                const eventType =
                    element.type === 'checkbox' || element.getAttribute('role') === 'switch' ? 'change' : 'input';

                const nativeEvent = new Event(eventType, { bubbles: true });
                element.dispatchEvent(nativeEvent);

                setTimeout(() => {
                    const submitEvent = new Event('submit', { bubbles: true });
                    form.dispatchEvent(submitEvent);

                    setTimeout(() => {
                        // Only focus text inputs and textareas
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

        // Store cleanup function
        element._autoSubmitCleanup = () => {
            element.removeEventListener(triggerEvent, handleInput);
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
        const role = element.getAttribute('role');

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
