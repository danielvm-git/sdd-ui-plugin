/**
 * SDD UI Core - Main Application Logic
 */

const API_BASE = window.location.protocol === 'file:' ? 'http://127.0.0.1:3000' : ''

const state = {
  sources: [],
  currentSource: null,
  onboardingComplete: localStorage.getItem('sdd-onboarding-complete') === 'true',
  /** @type {Record<string, object>} */
  overviewById: {},
  lastUpdatedAt: /** @type {number|null} */ (null),
  /** @type {string|null} */
  lastStateSha: null,
  /** @type {ReturnType<typeof setInterval>|null} */
  pollId: null
}

const elements = {
  sourcesList: document.getElementById('sources-list'),
  mainArea: document.getElementById('main-area'),
  projectTitle: document.getElementById('current-project-title'),
  addSourceBtnSidebar: document.getElementById('add-source-btn-sidebar'),
  onboardingOverlay: document.getElementById('onboarding-overlay'),
  closeOnboardingBtn: document.getElementById('close-onboarding'),

  addSourceModal: document.getElementById('add-source-modal'),
  closeModalBtn: document.getElementById('close-modal'),
  cancelAddSourceBtn: document.getElementById('cancel-add-source'),
  confirmAddSourceBtn: document.getElementById('confirm-add-source'),
  sourceNameInput: document.getElementById('source-name'),
  sourcePathInput: document.getElementById('source-path'),
  directoryPickerContainer: document.getElementById('directory-picker-container'),
  pickDirectoryBtn: document.getElementById('pick-directory-btn')
}

/**
 * @param {string} path
 */
function apiUrl(path) {
  if (!path.startsWith('/')) {
    return API_BASE + '/' + path
  }
  return API_BASE + path
}

/**
 * @param {string} id
 * Overview: GET /api/source/overview?sourceId (used by fetch, poll, manual refresh)
 */
async function fetchSourceOverview(id) {
  const res = await fetch(
    apiUrl('/api/source/overview?sourceId=' + encodeURIComponent(id))
  )
  if (!res.ok) {
    const err = { error: true, status: res.status }
    state.overviewById[id] = err
    if (id === state.currentSource) {
      state.lastUpdatedAt = Date.now()
    }
    return err
  }
  const j = await res.json().catch(() => ({}))
  state.overviewById[id] = j
  if (id === state.currentSource) {
    state.lastUpdatedAt = Date.now()
    if (j.state && j.state.content_sha256) {
      state.lastStateSha = j.state.content_sha256
    }
  }
  return j
}

function clearViewPoll() {
  if (state.pollId != null) {
    clearInterval(state.pollId)
    state.pollId = null
  }
}

function pollOverview() {
  if (document.visibilityState === 'hidden' || !state.currentSource) {
    return
  }
  const sid = state.currentSource
  fetchSourceOverview(sid).then(() => {
    render()
  })
}

function syncViewPoll() {
  clearViewPoll()
  if (!state.currentSource) {
    return
  }
  state.pollId = setInterval(pollOverview, 3000)
}

/**
 * @param {number|null} ts
 */
function formatUpdatedAgo(ts) {
  if (ts == null) {
    return ''
  }
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000))
  if (s < 60) {
    return 'Updated ' + s + 's ago'
  }
  const m = Math.floor(s / 60)
  if (m < 60) {
    return 'Updated ' + m + 'm ago'
  }
  const h = Math.floor(m / 60)
  return 'Updated ' + h + 'h ago'
}

/**
 * @param {HTMLElement} wrap
 * @param {{ id: string, name: string, path: string }} source
 */
function appendCurrentStatusBlock(wrap, source) {
  const h3 = document.createElement('h3')
  h3.className = 'section-title'
  h3.textContent = 'Current status'
  wrap.appendChild(h3)

  const ov = state.overviewById[source.id]
  if (ov == null) {
    const loading = document.createElement('p')
    loading.className = 'text-muted'
    loading.textContent = 'Loading current status…'
    wrap.appendChild(loading)
  } else if (ov.error) {
    const errH = document.createElement('h4')
    errH.className = 'subheading'
    errH.textContent = "Couldn't load status"
    wrap.appendChild(errH)
    const p = document.createElement('p')
    p.className = 'text-muted'
    p.textContent =
      'Check that the SDD UI server is running, then use Refresh status.'
    wrap.appendChild(p)
    if (ov.status) {
      const s = document.createElement('p')
      s.className = 'text-dim'
      s.textContent = 'HTTP ' + String(ov.status)
      wrap.appendChild(s)
    }
  } else if (ov.state == null || (ov.state && ov.state.error === 'missing')) {
    const miss = document.createElement('h4')
    miss.className = 'subheading'
    miss.textContent = 'No status file yet'
    wrap.appendChild(miss)
    const p = document.createElement('p')
    p.className = 'text-muted'
    p.textContent =
      'This folder has no .planning/STATE.md. Initialize your SDD workflow, then return here or use Refresh status.'
    wrap.appendChild(p)
  } else {
    const st = ov.state
    if (st.error === 'read_failed') {
      const e = document.createElement('p')
      e.className = 'text-muted'
      e.textContent = 'Could not read .planning/STATE.md.'
      wrap.appendChild(e)
    } else {
      const card = document.createElement('div')
      card.className = 'current-focus'
      const focus = st.focus && typeof st.focus === 'object' ? st.focus : {}
      const row = (label, key) => {
        const d = document.createElement('div')
        d.className = 'current-focus__row'
        const lb = document.createElement('span')
        lb.className = 'current-focus__label'
        lb.textContent = label
        const val = document.createElement('span')
        val.className = 'current-focus__value'
        const t =
          focus[key] != null && String(focus[key]).trim()
            ? String(focus[key])
            : '—'
        val.textContent = t
        d.appendChild(lb)
        d.appendChild(val)
        return d
      }
      card.appendChild(row('Phase', 'phase'))
      card.appendChild(row('Plan', 'plan'))
      card.appendChild(row('Status', 'status'))
      card.appendChild(row('Progress', 'progress'))
      wrap.appendChild(card)
    }
  }

  const actions = document.createElement('div')
  actions.className = 'status-actions'
  const refresh = document.createElement('button')
  refresh.type = 'button'
  refresh.className = 'btn-primary'
  refresh.setAttribute('data-action', 'refresh-status')
  refresh.textContent = 'Refresh status'
  actions.appendChild(refresh)
  wrap.appendChild(actions)

  const lu = document.createElement('p')
  lu.className = 'last-updated'
  lu.textContent = formatUpdatedAgo(state.lastUpdatedAt)
  wrap.appendChild(lu)
}

/**
 * Initialize the application
 */
async function init() {
  if ('showDirectoryPicker' in window) {
    elements.directoryPickerContainer.classList.remove('hidden')
  }

  if (window.lucide) {
    window.lucide.createIcons()
  }

  setupEventListeners()

  await fetchSources()

  render()

  checkOnboarding()
}

/**
 * Fetch sources from the API
 */
async function fetchSources() {
  try {
    const response = await fetch(apiUrl('/api/registry'))
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data)) {
        state.sources = data
      } else {
        state.sources = data.sources || []
      }
      await Promise.all(state.sources.map((s) => fetchSourceOverview(s.id)))
    }
  } catch (error) {
    console.error('Failed to fetch sources:', error)
    state.sources = []
  }
}

/**
 * Add a new source via the API
 */
async function addSource(name, path) {
  try {
    const response = await fetch(apiUrl('/api/registry'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, path, type: 'local' })
    })

    if (response.ok) {
      const newSource = await response.json()
      state.sources.push(newSource)
      state.currentSource = newSource.id
      hideAddSourceModal()
      await fetchSourceOverview(newSource.id)
      state.lastUpdatedAt = Date.now()
      render()
      return true
    }
    const error = await response.json()
    alert(`Failed to add source: ${error.error || 'Unknown error'}`)
    return false
  } catch (error) {
    console.error('Error adding source:', error)
    alert('An error occurred while adding the source.')
    return false
  }
}

/**
 * Show the Add Source modal
 */
function showAddSourceModal() {
  elements.addSourceModal.classList.remove('hidden')
  elements.sourceNameInput.value = ''
  elements.sourcePathInput.value = ''
  elements.sourceNameInput.focus()
}

/**
 * Hide the Add Source modal
 */
function hideAddSourceModal() {
  elements.addSourceModal.classList.add('hidden')
}

/**
 * Pick a directory using the Browser API
 */
async function pickDirectory() {
  try {
    const dirHandle = await window.showDirectoryPicker()
    elements.sourceNameInput.value = dirHandle.name
    alert(
      'Browser security prevents getting the full absolute path automatically. Please paste the absolute path in the input field.'
    )
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err)
    }
  }
}

/**
 * Render the UI based on current state
 */
function render() {
  renderSidebar()
  renderMainArea()
  if (window.lucide) {
    window.lucide.createIcons()
  }
  syncViewPoll()
}

/**
 * Render the sidebar sources list
 */
function renderSidebar() {
  const ul = elements.sourcesList
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild)
  }
  if (state.sources.length === 0) {
    const li = document.createElement('li')
    li.className = 'sidebar-item empty'
    li.textContent = 'No sources'
    ul.appendChild(li)
    return
  }
  for (const source of state.sources) {
    const li = document.createElement('li')
    li.className =
      'sidebar-item' + (state.currentSource === source.id ? ' active' : '')
    li.dataset.id = source.id
    const icon = document.createElement('i')
    icon.setAttribute('data-lucide', 'folder')
    const name = document.createElement('span')
    name.className = 'sidebar-name'
    name.textContent = source.name
    const badges = document.createElement('div')
    badges.className = 'method-badges'
    const ov = state.overviewById[source.id]
    if (ov && !ov.error && Array.isArray(ov.methods)) {
      for (const m of ov.methods) {
        const b = document.createElement('span')
        b.className = 'method-badge'
        b.textContent = m
        badges.appendChild(b)
      }
    } else if (ov && ov.error) {
      const b = document.createElement('span')
      b.className = 'method-badge method-badge--warn'
      b.textContent = '!'
      badges.appendChild(b)
    } else {
      const d = document.createElement('span')
      d.className = 'text-muted'
      d.style.fontSize = '12px'
      d.textContent = '…'
      badges.appendChild(d)
    }
    li.appendChild(icon)
    li.appendChild(name)
    li.appendChild(badges)
    ul.appendChild(li)
  }
}

/**
 * Render the main content area
 */
function renderMainArea() {
  if (state.sources.length === 0) {
    renderEmptyState()
    return
  }

  if (!state.currentSource) {
    elements.mainArea.innerHTML = `
            <div class="select-project-prompt">
                <i data-lucide="arrow-left"></i>
                <p>Select a project from the sidebar to view its status.</p>
            </div>
        `
    elements.projectTitle.textContent = 'Select a Project'
    return
  }

  const source = state.sources.find((s) => s.id === state.currentSource)
  if (!source) {
    return
  }

  elements.projectTitle.textContent = source ? source.name : 'Unknown Project'

  while (elements.mainArea.firstChild) {
    elements.mainArea.removeChild(elements.mainArea.firstChild)
  }

  const wrap = document.createElement('div')
  wrap.className = 'project-dashboard'
  const h2 = document.createElement('h2')
  h2.className = 'dashboard-title'
  h2.appendChild(
    document.createTextNode('Dashboard for ' + (source ? source.name : 'Unknown'))
  )
  wrap.appendChild(h2)

  const pathP = document.createElement('p')
  pathP.className = 'overview-path-line'
  pathP.appendChild(document.createTextNode('Project path: '))
  const code = document.createElement('code')
  code.textContent = source && source.path ? source.path : 'N/A'
  pathP.appendChild(code)
  wrap.appendChild(pathP)

  appendCurrentStatusBlock(wrap, source)

  const cardRow = document.createElement('div')
  cardRow.className = 'dashboard-grid'
  const c2 = document.createElement('div')
  c2.className = 'dashboard-card'
  const qh = document.createElement('h3')
  qh.textContent = 'Quick actions'
  c2.appendChild(qh)
  const p2 = document.createElement('p')
  p2.className = 'text-muted'
  p2.textContent =
    'Add or update .planning/STATE.md in your project, then use Refresh status or wait for the next poll.'
  c2.appendChild(p2)
  cardRow.appendChild(c2)
  wrap.appendChild(cardRow)

  elements.mainArea.appendChild(wrap)
}

/**
 * Render the empty state
 */
function renderEmptyState() {
  elements.projectTitle.textContent = 'Get Started'
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
    `

  const addSourceBtnMain = document.getElementById('add-source-btn-main')
  if (addSourceBtnMain) {
    addSourceBtnMain.addEventListener('click', showAddSourceModal)
  }
}

/**
 * Check and show onboarding if needed
 */
function checkOnboarding() {
  if (!state.onboardingComplete && state.sources.length === 0) {
    elements.onboardingOverlay.classList.remove('hidden')
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  elements.closeOnboardingBtn.addEventListener('click', () => {
    state.onboardingComplete = true
    localStorage.setItem('sdd-onboarding-complete', 'true')
    elements.onboardingOverlay.classList.add('hidden')
  })

  elements.addSourceBtnSidebar.addEventListener('click', showAddSourceModal)
  elements.closeModalBtn.addEventListener('click', hideAddSourceModal)
  elements.cancelAddSourceBtn.addEventListener('click', hideAddSourceModal)
  elements.pickDirectoryBtn.addEventListener('click', pickDirectory)

  elements.confirmAddSourceBtn.addEventListener('click', () => {
    const name = elements.sourceNameInput.value.trim()
    const path = elements.sourcePathInput.value.trim()
    if (name && path) {
      addSource(name, path)
    } else {
      alert('Please provide both a name and an absolute path.')
    }
  })

  elements.sourcesList.addEventListener('click', (e) => {
    const item = e.target.closest('.sidebar-item')
    if (item && !item.classList.contains('empty')) {
      state.currentSource = item.dataset.id
      state.lastStateSha = null
      if (item.dataset.id) {
        fetchSourceOverview(item.dataset.id).then(() => {
          state.lastUpdatedAt = Date.now()
          render()
        })
      } else {
        render()
      }
    }
  })

  elements.mainArea.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="refresh-status"]')) {
      if (!state.currentSource) {
        return
      }
      const card = elements.mainArea.querySelector('.current-focus')
      if (card) {
        card.classList.add('current-focus--pulse')
        setTimeout(() => {
          card.classList.remove('current-focus--pulse')
        }, 200)
      }
      fetchSourceOverview(state.currentSource).then(() => {
        state.lastUpdatedAt = Date.now()
        render()
      })
    }
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      clearViewPoll()
    } else if (state.currentSource) {
      fetchSourceOverview(state.currentSource).then(() => {
        state.lastUpdatedAt = Date.now()
        render()
      })
    }
  })

  window.addEventListener('beforeunload', () => {
    clearViewPoll()
  })
}

document.addEventListener('DOMContentLoaded', init)
