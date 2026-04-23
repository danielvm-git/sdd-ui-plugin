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
    closeOnboardingBtn: document.getElementById('close-onboarding')
};

/**
 * Initialize the application
 */
async function init() {
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
            <p>Project path: ${source ? source.path : 'N/A'}</p>
            <p>Status: Monitoring...</p>
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
        addSourceBtnMain.addEventListener('click', () => {
            alert('Add Source functionality coming in Plan 03!');
        });
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

    elements.addSourceBtnSidebar.addEventListener('click', () => {
        alert('Add Source functionality coming in Plan 03!');
    });

    // Use event delegation for sidebar items
    elements.sourcesList.addEventListener('click', (e) => {
        const item = e.target.closest('.sidebar-item');
        if (item && !item.classList.contains('empty')) {
            state.currentSource = item.dataset.id;
            render();
        }
    });

    // Handle initial empty state button if present
    const addSourceBtnMain = document.getElementById('add-source-btn-main');
    if (addSourceBtnMain) {
        addSourceBtnMain.addEventListener('click', () => {
            alert('Add Source functionality coming in Plan 03!');
        });
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
