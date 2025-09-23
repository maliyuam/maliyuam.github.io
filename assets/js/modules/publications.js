// Publications section functionality
export function initPublications() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publicationCards = document.querySelectorAll('.publication-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.dataset.filter;

            // Filter publications
            publicationCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('visible'), 100);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('visible');
                }
            });
        });
    });

    // Citation metrics animation
    const counters = document.querySelectorAll('.counter');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.innerText);
                let count = 0;
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps

                const updateCounter = () => {
                    count += increment;
                    if (count < target) {
                        counter.innerText = Math.round(count);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };

                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    counters.forEach(counter => observer.observe(counter));

    // Initialize research impact map
    initResearchMap();
}

// Research impact map initialization
function initResearchMap() {
    const mapContainer = document.getElementById('researchImpactMap');
    if (!mapContainer) return;

    // Initialize map (using a mapping library of your choice)
    // Example using Leaflet.js:
    const map = L.map(mapContainer).setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Add research impact points
    const impactPoints = [
        { lat: 50.8798, lng: 4.7005, name: 'KU Leuven', citations: 45 },
        { lat: 40.4433, lng: -79.9436, name: 'Carnegie Mellon', citations: 30 },
        // Add more impact points
    ];

    impactPoints.forEach(point => {
        const marker = L.marker([point.lat, point.lng])
            .bindPopup(`
                <strong>${point.name}</strong><br>
                Citations: ${point.citations}
            `)
            .addTo(map);

        // Add pulse animation to markers
        marker._icon.classList.add('marker-pulse');
    });
}

// Citation chart initialization
function initCitationChart() {
    const ctx = document.getElementById('citationsChart').getContext('2d');
    if (!ctx) return;

    // Example using Chart.js
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Citations per Year',
                data: [10, 25, 45, 80, 90],
                borderColor: 'var(--primary-color)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}