// Lightweight custom dropdown that mirrors a native <select> element.
// - Hides the original select visually but keeps it as the source of truth.
// - Renders a custom trigger and option list for full styling control.
// - Syncs value both ways via the select's change event.

const ENHANCED_FLAG = 'dmCustomSelectEnhanced';

export function enhanceSelect(selectEl) {
    if (!selectEl || selectEl.dataset[ENHANCED_FLAG] === 'true') return;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'dm-custom-select';

    // Create trigger
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'dm-custom-select-trigger';

    // Create options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'dm-custom-select-options';

    wrapper.appendChild(trigger);
    wrapper.appendChild(optionsContainer);

    // Insert wrapper before select, then move select inside
    const parent = selectEl.parentElement;
    if (!parent) return;
    parent.insertBefore(wrapper, selectEl);
    wrapper.appendChild(selectEl);

    // Hide the native select but keep it functional
    selectEl.classList.add('dm-custom-select-native');
    selectEl.dataset[ENHANCED_FLAG] = 'true';

    const buildOptions = () => {
        optionsContainer.innerHTML = '';

        const frag = document.createDocumentFragment();
        Array.from(selectEl.options).forEach(option => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'dm-custom-select-option';
            item.textContent = option.textContent;
            item.dataset.value = option.value;
            if (option.selected) {
                item.classList.add('selected');
            }
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (selectEl.value !== option.value) {
                    selectEl.value = option.value;
                    const event = new Event('change', { bubbles: true });
                    selectEl.dispatchEvent(event);
                }
                updateTrigger();
                closeAll(wrapper);
            });
            frag.appendChild(item);
        });
        optionsContainer.appendChild(frag);
    };

    const updateTrigger = () => {
        const selected = selectEl.options[selectEl.selectedIndex];
        trigger.textContent = selected ? selected.textContent : 'Select';

        // Update selected state in option list
        const items = optionsContainer.querySelectorAll('.dm-custom-select-option');
        items.forEach(item => {
            item.classList.toggle('selected', item.dataset.value === selectEl.value);
        });
    };

    const toggleOpen = () => {
        const isOpen = wrapper.classList.contains('open');
        closeAll();
        if (!isOpen) {
            // Decide whether to open dropdown above or below based on viewport space
            wrapper.classList.remove('open-up');
            const rect = wrapper.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const optionsHeight = Math.min(optionsContainer.scrollHeight, 260); // match CSS max-height
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            if (spaceBelow < optionsHeight && spaceAbove > spaceBelow) {
                // More space above than below: open upwards
                wrapper.classList.add('open-up');
            }

            wrapper.classList.add('open');
        }
    };

    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleOpen();
    });

    // Rebuild options when the native select fires a change event externally
    selectEl.addEventListener('change', () => {
        buildOptions();
        updateTrigger();
    });

    // Initial build
    buildOptions();
    updateTrigger();

    registerGlobalClickHandler();
}

// Allow callers to refresh the custom UI after they mutate <select> options.
export function refreshEnhancedSelect(selectEl) {
    if (!selectEl || selectEl.dataset[ENHANCED_FLAG] !== 'true') return;
    const wrapper = selectEl.closest('.dm-custom-select');
    if (!wrapper) return;

    const trigger = wrapper.querySelector('.dm-custom-select-trigger');
    const optionsContainer = wrapper.querySelector('.dm-custom-select-options');
    if (!trigger || !optionsContainer) return;

    optionsContainer.innerHTML = '';
    const frag = document.createDocumentFragment();
    Array.from(selectEl.options).forEach(option => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'dm-custom-select-option';
        item.textContent = option.textContent;
        item.dataset.value = option.value;
        if (option.selected) {
            item.classList.add('selected');
        }
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (selectEl.value !== option.value) {
                selectEl.value = option.value;
                const event = new Event('change', { bubbles: true });
                selectEl.dispatchEvent(event);
            }
            refreshEnhancedSelect(selectEl);
            closeAll(wrapper);
        });
        frag.appendChild(item);
    });
    optionsContainer.appendChild(frag);

    const selected = selectEl.options[selectEl.selectedIndex];
    trigger.textContent = selected ? selected.textContent : 'Select';
}

let globalClickHandlerRegistered = false;

function registerGlobalClickHandler() {
    if (globalClickHandlerRegistered) return;
    globalClickHandlerRegistered = true;

    document.addEventListener('click', () => {
        closeAll();
    });
}

function closeAll(exceptWrapper) {
    const all = document.querySelectorAll('.dm-custom-select.open');
    all.forEach(w => {
        if (w !== exceptWrapper) {
            w.classList.remove('open');
        }
    });
}

