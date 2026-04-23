/**
 * SDD UI Core - Main Application Logic
 */

const state = {
    sources: [],
    currentSource: null,
    onboardingComplete: localStorage.getItem('sdd-onboarding-complete') === 'true'
};

const elements = {
    sourcesList: document.getElementById('sources-list'),
    mainArea: document.getElementById('main-area'),
    projectTitle: document.getElementById('current-project-title'),
    addSourceBtnSidebar: document.getElementById('add-source-btn-sidebar'),
    onboardingOverlay: document.getElementById('onboarding-overlay'),
    closeOnboardingBtn: document.getElementById('close-onboarding'),
    
    // Add Source Modal elements
    addSourceModal: document.getElementById('add-source-modal'),
    closeModalBtn: document.getElementById('close-modal'),
    cancelAddSourceBtn: document.getElementById('cancel-add-source'),
    confirmAddSourceBtn: document.getElementById('confirm-add-source'),
    sourceNameInput: document.getElementById('source-name'),
    sourcePathInput: document.getElementById('source-path'),
    directoryPickerContainer: document.getElementById('directory-picker-container'),
    pickDirectoryBtn: document.getElementById('pick-directory-btn')
};

/**
 * Initialize the application
 */
async function init() {
    // Check if directory picker is available
    if ('showDirectoryPicker' in window) {
        elements.directoryPickerContainer.classList.remove('hidden');
    }

    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Setup initial event listeners
    setupEventListeners();

    // Fetch initial sources
    await fetchSources();

    // Render initial state
    render();

    // Check onboarding
    checkOnboarding();
}

/**
 * Fetch sources from the API
 */
async function fetchSources() {
    try {
        const response = await fetch('/api/registry');
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
                state.sources = data;
            } else {
                state.sources = data.sources || [];
            }
        }
    } catch (error) {
        console.error('Failed to fetch sources:', error);
        state.sources = [];
    }
}

/**
 * Add a new source via the API
 */
async function addSource(name, path) {
    try {
        const response = await fetch('/api/registry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, path, type: 'local' })
        });

        if (response.ok) {
            const newSource = await response.json();
            state.sources.push(newSource);
            state.currentSource = newSource.id;
            hideAddSourceModal();
            render();
            return true;
        } else {
            const error = await response.json();
            alert(`Failed to add source: ${error.error || 'Unknown error'}`);
            return false;
        }
    } catch (error) {
        console.error('Error adding source:', error);
        alert('An error occurred while adding the source.');
        return false;
    }
}

/**
 * Show the Add Source modal
 */
function showAddSourceModal() {
    elements.addSourceModal.classList.remove('hidden');
    elements.sourceNameInput.value = '';
    elements.sourcePathInput.value = '';
    elements.sourceNameInput.focus();
}

/**
 * Hide the Add Source modal
 */
function hideAddSourceModal() {
    elements.addSourceModal.classList.add('hidden');
}

/**
 * Pick a directory using the Browser API
 */
async function pickDirectory() {
    try {
        const dirHandle = await window.showDirectoryPicker();
        elements.sourceNameInput.value = dirHandle.name;
        // Note: Full path is not available via showDirectoryPicker for security reasons
        // But for this local tool, we might need to ask the user to confirm the absolute path
        // OR we can try to infer it if we're running in a context where we know the root.
        // For now, we'll just put the name and let the user fill the path or use the name as a hint.
        alert('Browser security prevents getting the full absolute path automatically. Please paste the absolute path in the input field.');
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error(err);
        }
    }
}

/**
 * Render the UI based on current state
 */
function render() {
    renderSidebar();
    renderMainArea();
    
    // Refresh icons for any new elements
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

/**
 * Render the sidebar sources list
 */
function renderSidebar() {
    if (state.sources.length === 0) {
        elements.sourcesList.innerHTML = '<li class="sidebar-item empty">No sources</li>';
        return;
    }

    elements.sourcesList.innerHTML = state.sources.map(source => `
        <li class="sidebar-item ${state.currentSource === source.id ? 'active' : ''}" data-id="${source.id}">
            <i data-lucide="folder"></i>
            <span>${source.name}</span>
        </li>
    `).join('');
}

/**
 * Render the main content area
 */
function renderMainArea() {
    if (state.sources.length === 0) {
        renderEmptyState();
        return;
    }

    if (!state.currentSource) {
        elements.mainArea.innerHTML = `
            <div class="select-project-prompt">
                <i data-lucide="arrow-left"></i>
                <p>Select a project from the sidebar to view its status.</p>
            </div>
        `;
        elements.projectTitle.textContent = 'Select a Project';
        return;
    }

    // Placeholder for project view
    const source = state.sources.find(s => s.id === state.currentSource);
    elements.projectTitle.textContent = source ? source.name : 'Unknown Project';
    elements.mainArea.innerHTML = `
        <div class="project-dashboard">
            <h2>Dashboard for ${source ? source.name : 'Unknown'}</h2>
            <p>Project path: <code>${source ? source.path : 'N/A'}</code></p>
            <p>Status: Monitoring...</p>
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3>Recent Status</h3>
                    <p>No status reports found.</p>
                </div>
                <div class="dashboard-card">
                    <h3>Quick Actions</h3>
                    <button class="btn-secondary">Open Roadmap</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render the empty state
 */
function renderEmptyState() {
    elements.projectTitle.textContent = 'Get Started';
    elements.mainArea.innerHTML = `
        <div class="empty-state">
            <i data-lucide="folder-plus" size="48"></i>
            <h2>No Projects Registered</h2>
            <p>Add a local directory to begin monitoring your SDD project status and roadmap.</p>
            <button id="add-source-btn-main" class="btn-primary">
                <i data-lucide="plus"></i>
                Add Project Source
            </button>
        </div>
    `;

    const addSourceBtnMain = document.getElementById('add-source-btn-main');
    if (addSourceBtnMain) {
        addSourceBtnMain.addEventListener('click', showAddSourceModal);
    }
}

/**
 * Check and show onboarding if needed
 */
function checkOnboarding() {
    if (!state.onboardingComplete && state.sources.length === 0) {
        elements.onboardingOverlay.classList.remove('hidden');
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    elements.closeOnboardingBtn.addEventListener('click', () => {
        state.onboardingComplete = true;
        localStorage.setItem('sdd-onboarding-complete', 'true');
        elements.onboardingOverlay.classList.add('hidden');
    });

    elements.addSourceBtnSidebar.addEventListener('click', showAddSourceModal);
    elements.closeModalBtn.addEventListener('click', hideAddSourceModal);
    elements.cancelAddSourceBtn.addEventListener('click', hideAddSourceModal);
    elements.pickDirectoryBtn.addEventListener('click', pickDirectory);

    elements.confirmAddSourceBtn.addEventListener('click', () => {
        const name = elements.sourceNameInput.value.trim();
        const path = elements.sourcePathInput.value.trim();
        if (name && path) {
            addSource(name, path);
        } else {
            alert('Please provide both a name and an absolute path.');
        }
    });

    // Use event delegation for sidebar items
    elements.sourcesList.addEventListener('click', (e) => {
        const item = e.target.closest('.sidebar-item');
        if (item && !item.classList.contains('empty')) {
            state.currentSource = item.dataset.id;
            render();
        }
    });
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
