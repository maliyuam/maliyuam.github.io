// Enhanced Publications Functionality
export function initPublicationsInteractive() {
    initSearch();
    initFilters();
    initModals();
    initCitations();
    initSharing();
    initMetrics();
}

// Search functionality with autocomplete
function initSearch() {
    const searchInput = document.getElementById('pubSearchInput');
    const suggestionsContainer = document.querySelector('.search-suggestions');
    let publications = []; // Will be populated with publication data

    searchInput.addEventListener('input', debounce(async (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const matches = publications.filter(pub => 
            pub.title.toLowerCase().includes(query) ||
            pub.authors.some(author => author.toLowerCase().includes(query))
        );

        renderSuggestions(matches);
    }, 300));

    function renderSuggestions(matches) {
        if (!matches.length) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        suggestionsContainer.innerHTML = matches
            .slice(0, 5)
            .map(pub => `
                <div class="suggestion-item" data-id="${pub.id}">
                    <strong>${highlightMatch(pub.title)}</strong>
                    <small>${pub.authors.join(', ')}</small>
                </div>
            `)
            .join('');

        suggestionsContainer.style.display = 'block';
    }
}

// Advanced filtering system
function initFilters() {
    const yearFrom = document.getElementById('yearFrom');
    const yearTo = document.getElementById('yearTo');
    const citationRange = document.getElementById('citationRange');
    const coauthorFilter = document.getElementById('coauthorFilter');
    const impactFilter = document.getElementById('impactFilter');
    const resetBtn = document.getElementById('resetFilters');

    // Initialize range slider
    const rangeValue = citationRange.nextElementSibling;
    citationRange.addEventListener('input', (e) => {
        rangeValue.textContent = `${e.target.value}+`;
        applyFilters();
    });

    // Year range validation
    yearFrom.addEventListener('change', () => {
        if (yearTo.value && parseInt(yearFrom.value) > parseInt(yearTo.value)) {
            yearTo.value = yearFrom.value;
        }
        applyFilters();
    });

    yearTo.addEventListener('change', () => {
        if (yearFrom.value && parseInt(yearTo.value) < parseInt(yearFrom.value)) {
            yearFrom.value = yearTo.value;
        }
        applyFilters();
    });

    // Reset filters
    resetBtn.addEventListener('click', () => {
        yearFrom.value = '';
        yearTo.value = '';
        citationRange.value = 0;
        rangeValue.textContent = '0+';
        coauthorFilter.value = 'all';
        impactFilter.value = 'all';
        applyFilters();
    });

    function applyFilters() {
        const filters = {
            yearFrom: yearFrom.value ? parseInt(yearFrom.value) : null,
            yearTo: yearTo.value ? parseInt(yearTo.value) : null,
            minCitations: parseInt(citationRange.value),
            coauthor: coauthorFilter.value,
            impact: impactFilter.value
        };

        const publications = document.querySelectorAll('.publication-card');
        publications.forEach(pub => {
            const matches = checkFilters(pub, filters);
            pub.style.display = matches ? 'block' : 'none';
        });
    }
}

// Modal management
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close-modal');

    // Close modal on clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    // Close button functionality
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Citation functionality
function initCitations() {
    const formatBtns = document.querySelectorAll('.format-btn');
    const copyBtn = document.getElementById('copyCitation');
    const downloadBtn = document.getElementById('downloadCitation');

    formatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            formatBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateCitationPreview(btn.dataset.format);
        });
    });

    copyBtn.addEventListener('click', async () => {
        const citation = document.getElementById('citationText').textContent;
        await navigator.clipboard.writeText(citation);
        showToast('Citation copied to clipboard!');
    });

    downloadBtn.addEventListener('click', () => {
        const format = document.querySelector('.format-btn.active').dataset.format;
        const citation = document.getElementById('citationText').textContent;
        downloadCitation(citation, format);
    });
}

// Sharing functionality
function initSharing() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const copyLinkBtn = document.querySelector('.copy-link');

    shareButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.classList[1];
            const publicationData = getCurrentPublicationData();
            shareToSocialMedia(platform, publicationData);
        });
    });

    copyLinkBtn.addEventListener('click', async () => {
        const linkInput = copyLinkBtn.previousElementSibling;
        await navigator.clipboard.writeText(linkInput.value);
        showToast('Link copied to clipboard!');
    });
}

// Metrics visualization
function initMetrics() {
    // Initialize citation chart
    const chartOptions = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Citations',
                data: [],
                borderColor: 'var(--primary-color)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };

    // Initialize altmetrics
    function initAltmetrics(doi) {
        const badge = document.createElement('div');
        badge.className = 'altmetric-badge';
        badge.dataset.doi = doi;
        document.querySelector('.altmetrics-donut').appendChild(badge);
        
        // Load Altmetric badge script
        if (!window._altmetric) {
            const script = document.createElement('script');
            script.src = 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js';
            document.head.appendChild(script);
        }
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }, 100);
}

function downloadCitation(citation, format) {
    const blob = new Blob([citation], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citation.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}