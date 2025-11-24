// ===== Destination Class =====
class Destination {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.name = data.name || '';
        this.location = data.location || { lat: 0, lng: 0 };
        this.address = data.address || '';
        this.duration = data.duration || 2; // hours
        this.notes = data.notes || '';
        this.order = data.order || 0;
    }

    generateId() {
        return `dest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            location: this.location,
            address: this.address,
            duration: this.duration,
            notes: this.notes,
            order: this.order
        };
    }
}

// ===== Trip Class =====
class Trip {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.name = data.name || 'Untitled Trip';
        this.description = data.description || '';
        this.destinations = (data.destinations || []).map(d => new Destination(d));
        this.created = data.created || new Date().toISOString();
        this.modified = data.modified || new Date().toISOString();
        this.totalDistance = data.totalDistance || 0;
        this.totalDuration = data.totalDuration || 0;
    }

    generateId() {
        return `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    addDestination(destination) {
        destination.order = this.destinations.length;
        this.destinations.push(destination);
        this.updateModified();
    }

    removeDestination(destinationId) {
        this.destinations = this.destinations.filter(d => d.id !== destinationId);
        this.reorderDestinations();
        this.updateModified();
    }

    reorderDestinations() {
        this.destinations.forEach((dest, index) => {
            dest.order = index;
        });
    }

    updateModified() {
        this.modified = new Date().toISOString();
    }

    calculateTotals() {
        this.totalDuration = this.destinations.reduce((sum, dest) => sum + dest.duration, 0);
        // Distance calculation will be done with routes
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            destinations: this.destinations.map(d => d.toJSON()),
            created: this.created,
            modified: this.modified,
            totalDistance: this.totalDistance,
            totalDuration: this.totalDuration
        };
    }
}

// ===== Main Application =====
class TripPlannerApp {
    constructor() {
        this.trips = [];
        this.activeTrip = null;
        this.map = null;
        this.markers = [];
        this.route = null;
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';

        this.init();
    }

    // ===== Initialization =====
    init() {
        this.initMap();
        this.loadTrips();
        this.setupEventListeners();
        this.applyDarkMode();
        this.renderTripList();
        this.checkUrlParams();
    }

    // ===== Map Initialization =====
    initMap() {
        // Initialize Leaflet map
        this.map = L.map('map').setView([20, 0], 2);

        // Add OpenStreetMap tiles
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        });

        tileLayer.addTo(this.map);

        // Add click event to map
        this.map.on('click', (e) => this.handleMapClick(e));
    }

    // ===== Event Listeners =====
    setupEventListeners() {
        // Dark mode toggle
        document.getElementById('darkModeToggle').addEventListener('click', () => this.toggleDarkMode());

        // New trip button
        document.getElementById('newTripBtn').addEventListener('click', () => this.createNewTrip());

        // Panel toggle
        document.getElementById('togglePanelBtn').addEventListener('click', () => this.togglePanel());

        // Back to list
        document.getElementById('backToListBtn').addEventListener('click', () => this.showTripList());

        // Search
        document.getElementById('searchBtn').addEventListener('click', () => this.searchLocation());
        document.getElementById('locationSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchLocation();
        });

        // Trip actions
        document.getElementById('saveTripBtn').addEventListener('click', () => this.saveActiveTrip());
        document.getElementById('exportTripBtn').addEventListener('click', () => this.showExportModal());
        document.getElementById('shareTripBtn').addEventListener('click', () => this.showShareModal());
        document.getElementById('deleteTripBtn').addEventListener('click', () => this.deleteActiveTrip());

        // Map controls
        document.getElementById('centerMapBtn').addEventListener('click', () => this.centerMap());
        document.getElementById('clearRouteBtn').addEventListener('click', () => this.clearRoute());

        // Export modal
        document.getElementById('closeExportModal').addEventListener('click', () => this.closeExportModal());
        document.getElementById('exportJsonBtn').addEventListener('click', () => this.exportAsJson());
        document.getElementById('exportTextBtn').addEventListener('click', () => this.exportAsText());

        // Share modal
        document.getElementById('closeShareModal').addEventListener('click', () => this.closeShareModal());
        document.getElementById('copyLinkBtn').addEventListener('click', () => this.copyShareLink());

        // Trip name/description changes
        document.getElementById('tripName').addEventListener('input', (e) => {
            if (this.activeTrip) {
                this.activeTrip.name = e.target.value;
                this.activeTrip.updateModified();
            }
        });

        document.getElementById('tripDescription').addEventListener('input', (e) => {
            if (this.activeTrip) {
                this.activeTrip.description = e.target.value;
                this.activeTrip.updateModified();
            }
        });
    }

    // ===== Dark Mode =====
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        this.applyDarkMode();
        localStorage.setItem('darkMode', this.isDarkMode);
    }

    applyDarkMode() {
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
            document.getElementById('darkModeToggle').innerHTML = '<span class="icon">☀️</span>';
        } else {
            document.body.classList.remove('dark-mode');
            document.getElementById('darkModeToggle').innerHTML = '<span class="icon">🌙</span>';
        }
    }

    // ===== Panel Management =====
    togglePanel() {
        const panel = document.getElementById('sidePanel');
        panel.classList.toggle('collapsed');
    }

    showTripList() {
        document.getElementById('tripListView').style.display = 'block';
        document.getElementById('activeTripView').style.display = 'none';
        this.activeTrip = null;
        this.clearMap();
    }

    showActiveTripView() {
        document.getElementById('tripListView').style.display = 'none';
        document.getElementById('activeTripView').style.display = 'block';
    }

    // ===== Trip Management =====
    createNewTrip() {
        const trip = new Trip();
        this.activeTrip = trip;
        this.showActiveTripView();
        this.renderActiveTripView();
        this.clearMap();
    }

    loadTrip(tripId) {
        const trip = this.trips.find(t => t.id === tripId);
        if (trip) {
            this.activeTrip = trip;
            this.showActiveTripView();
            this.renderActiveTripView();
            this.renderDestinationsOnMap();
        }
    }

    saveActiveTrip() {
        if (!this.activeTrip) return;

        this.activeTrip.calculateTotals();
        this.activeTrip.updateModified();

        // Check if trip already exists
        const existingIndex = this.trips.findIndex(t => t.id === this.activeTrip.id);
        if (existingIndex >= 0) {
            this.trips[existingIndex] = this.activeTrip;
        } else {
            this.trips.push(this.activeTrip);
        }

        this.saveTripsToStorage();
        this.showToast('Trip saved successfully!', 'success');
        this.renderTripList();
    }

    deleteActiveTrip() {
        if (!this.activeTrip) return;

        if (confirm('Are you sure you want to delete this trip?')) {
            this.trips = this.trips.filter(t => t.id !== this.activeTrip.id);
            this.saveTripsToStorage();
            this.showToast('Trip deleted successfully!', 'success');
            this.showTripList();
            this.renderTripList();
        }
    }

    // ===== Storage =====
    saveTripsToStorage() {
        const data = this.trips.map(t => t.toJSON());
        localStorage.setItem('trips', JSON.stringify(data));
    }

    loadTrips() {
        const data = localStorage.getItem('trips');
        if (data) {
            try {
                const trips = JSON.parse(data);
                this.trips = trips.map(t => new Trip(t));
            } catch (error) {
                console.error('Error loading trips:', error);
                this.trips = [];
            }
        }
    }

    // ===== Rendering =====
    renderTripList() {
        const tripList = document.getElementById('tripList');

        if (this.trips.length === 0) {
            tripList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🗺️</div>
                    <p class="empty-state-text">No trips yet. Create your first trip!</p>
                </div>
            `;
            return;
        }

        // Sort trips by modified date (most recent first)
        const sortedTrips = [...this.trips].sort((a, b) =>
            new Date(b.modified) - new Date(a.modified)
        );

        tripList.innerHTML = sortedTrips.map(trip => `
            <div class="trip-card" data-trip-id="${trip.id}">
                <div class="trip-card-header">
                    <div class="trip-card-title">${trip.name}</div>
                </div>
                <div class="trip-card-meta">
                    Modified: ${new Date(trip.modified).toLocaleDateString()}
                </div>
                <div class="trip-card-stats">
                    <span>📍 ${trip.destinations.length} stops</span>
                    <span>⏱️ ${trip.totalDuration}h</span>
                    <span>🛣️ ${trip.totalDistance.toFixed(0)}km</span>
                </div>
            </div>
        `).join('');

        // Add click listeners to trip cards
        tripList.querySelectorAll('.trip-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const tripId = e.currentTarget.dataset.tripId;
                this.loadTrip(tripId);
            });
        });
    }

    renderActiveTripView() {
        if (!this.activeTrip) return;

        // Set trip name and description
        document.getElementById('tripName').value = this.activeTrip.name;
        document.getElementById('tripDescription').value = this.activeTrip.description;

        // Render destinations
        this.renderDestinations();

        // Update summary
        this.updateTripSummary();
    }

    renderDestinations() {
        if (!this.activeTrip) return;

        const container = document.getElementById('destinationsList');
        const destinations = this.activeTrip.destinations;

        if (destinations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p class="empty-state-text">No destinations yet. Search or click on the map to add one.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = destinations.map((dest, index) => `
            <div class="destination-item" data-dest-id="${dest.id}">
                <div class="destination-number">${index + 1}</div>
                <div class="destination-content">
                    <div class="destination-name">${dest.name}</div>
                    <div class="destination-address">${dest.address}</div>
                    <div class="destination-duration">
                        <label>Duration:</label>
                        <input type="number" min="0.5" step="0.5" value="${dest.duration}"
                               data-dest-id="${dest.id}" class="duration-input" /> hours
                    </div>
                </div>
                <div class="destination-actions">
                    <button class="btn-icon" onclick="app.removeDestination('${dest.id}')" title="Remove">
                        <span class="icon">🗑️</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Add duration change listeners
        container.querySelectorAll('.duration-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const destId = e.target.dataset.destId;
                const destination = this.activeTrip.destinations.find(d => d.id === destId);
                if (destination) {
                    destination.duration = parseFloat(e.target.value);
                    this.activeTrip.updateModified();
                    this.updateTripSummary();
                }
            });
        });

        // Update destination count
        document.getElementById('destinationCount').textContent = destinations.length;
    }

    updateTripSummary() {
        if (!this.activeTrip) return;

        this.activeTrip.calculateTotals();

        document.getElementById('totalDistance').textContent = `${this.activeTrip.totalDistance.toFixed(1)} km`;
        document.getElementById('totalDuration').textContent = `${this.activeTrip.totalDuration} hours`;
        document.getElementById('destinationCountSummary').textContent = this.activeTrip.destinations.length;
    }

    // ===== Map Management =====
    clearMap() {
        // Remove all markers
        this.markers.forEach(marker => marker.remove());
        this.markers = [];

        // Remove route
        if (this.route) {
            this.route.remove();
            this.route = null;
        }
    }

    renderDestinationsOnMap() {
        if (!this.activeTrip) return;

        this.clearMap();

        const destinations = this.activeTrip.destinations;
        if (destinations.length === 0) return;

        // Add markers
        destinations.forEach((dest, index) => {
            const marker = L.marker([dest.location.lat, dest.location.lng])
                .addTo(this.map)
                .bindPopup(`
                    <strong>${index + 1}. ${dest.name}</strong><br>
                    ${dest.address}<br>
                    Duration: ${dest.duration}h
                `);
            this.markers.push(marker);
        });

        // Draw route
        if (destinations.length > 1) {
            this.drawRoute(destinations);
        }

        // Fit map to bounds
        this.centerMap();
    }

    async drawRoute(destinations) {
        if (destinations.length < 2) return;

        const coordinates = destinations.map(d => [d.location.lat, d.location.lng]);

        // Create polyline
        this.route = L.polyline(coordinates, {
            color: '#3182ce',
            weight: 3,
            opacity: 0.7
        }).addTo(this.map);

        // Calculate total distance
        let totalDistance = 0;
        for (let i = 0; i < coordinates.length - 1; i++) {
            const from = L.latLng(coordinates[i]);
            const to = L.latLng(coordinates[i + 1]);
            totalDistance += from.distanceTo(to) / 1000; // Convert to km
        }

        if (this.activeTrip) {
            this.activeTrip.totalDistance = totalDistance;
            this.updateTripSummary();
        }
    }

    clearRoute() {
        if (this.route) {
            this.route.remove();
            this.route = null;
        }
        if (this.activeTrip) {
            this.activeTrip.totalDistance = 0;
            this.updateTripSummary();
        }
    }

    centerMap() {
        if (this.markers.length === 0) {
            this.map.setView([20, 0], 2);
            return;
        }

        const group = L.featureGroup(this.markers);
        this.map.fitBounds(group.getBounds().pad(0.1));
    }

    handleMapClick(e) {
        if (!this.activeTrip) {
            this.showToast('Please create or select a trip first', 'warning');
            return;
        }

        const { lat, lng } = e.latlng;
        this.reverseGeocode(lat, lng);
    }

    // ===== Geocoding =====
    async searchLocation() {
        const query = document.getElementById('locationSearch').value.trim();
        if (!query) return;

        this.showLoading();

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
            );
            const results = await response.json();

            this.displaySearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            this.showToast('Search failed. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    displaySearchResults(results) {
        const container = document.getElementById('searchResults');

        if (results.length === 0) {
            container.innerHTML = '<div class="search-result-item">No results found</div>';
            container.classList.add('visible');
            return;
        }

        container.innerHTML = results.map(result => `
            <div class="search-result-item" data-lat="${result.lat}" data-lon="${result.lon}"
                 data-name="${result.display_name.split(',')[0]}"
                 data-address="${result.display_name}">
                <div class="search-result-name">${result.display_name.split(',')[0]}</div>
                <div class="search-result-address">${result.display_name}</div>
            </div>
        `).join('');

        container.classList.add('visible');

        // Add click listeners
        container.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const lat = parseFloat(e.currentTarget.dataset.lat);
                const lon = parseFloat(e.currentTarget.dataset.lon);
                const name = e.currentTarget.dataset.name;
                const address = e.currentTarget.dataset.address;

                this.addDestination(name, address, lat, lon);
                container.classList.remove('visible');
                document.getElementById('locationSearch').value = '';
            });
        });
    }

    async reverseGeocode(lat, lng) {
        this.showLoading();

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const result = await response.json();

            const name = result.address.amenity ||
                        result.address.tourism ||
                        result.address.road ||
                        result.address.city ||
                        'Custom Location';
            const address = result.display_name;

            this.addDestination(name, address, lat, lng);
        } catch (error) {
            console.error('Reverse geocode error:', error);
            this.showToast('Failed to get location details', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // ===== Destination Management =====
    addDestination(name, address, lat, lng) {
        if (!this.activeTrip) return;

        const destination = new Destination({
            name,
            address,
            location: { lat, lng }
        });

        this.activeTrip.addDestination(destination);
        this.renderDestinations();
        this.renderDestinationsOnMap();
        this.showToast('Destination added!', 'success');
    }

    removeDestination(destinationId) {
        if (!this.activeTrip) return;

        this.activeTrip.removeDestination(destinationId);
        this.renderDestinations();
        this.renderDestinationsOnMap();
        this.showToast('Destination removed', 'success');
    }

    // ===== Export =====
    showExportModal() {
        if (!this.activeTrip) return;
        document.getElementById('exportModal').style.display = 'flex';
    }

    closeExportModal() {
        document.getElementById('exportModal').style.display = 'none';
    }

    exportAsJson() {
        if (!this.activeTrip) return;

        const data = JSON.stringify(this.activeTrip.toJSON(), null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.activeTrip.name.replace(/[^a-z0-9]/gi, '_')}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.closeExportModal();
        this.showToast('Trip exported as JSON!', 'success');
    }

    exportAsText() {
        if (!this.activeTrip) return;

        let text = `${this.activeTrip.name}\n`;
        text += `${this.activeTrip.description}\n\n`;
        text += `Total Distance: ${this.activeTrip.totalDistance.toFixed(1)} km\n`;
        text += `Total Duration: ${this.activeTrip.totalDuration} hours\n\n`;
        text += `Destinations:\n`;

        this.activeTrip.destinations.forEach((dest, index) => {
            text += `\n${index + 1}. ${dest.name}\n`;
            text += `   ${dest.address}\n`;
            text += `   Duration: ${dest.duration} hours\n`;
            text += `   Location: ${dest.location.lat}, ${dest.location.lng}\n`;
        });

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.activeTrip.name.replace(/[^a-z0-9]/gi, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        this.closeExportModal();
        this.showToast('Trip exported as text!', 'success');
    }

    // ===== Share =====
    showShareModal() {
        if (!this.activeTrip) return;

        const data = encodeURIComponent(JSON.stringify(this.activeTrip.toJSON()));
        const url = `${window.location.origin}${window.location.pathname}?trip=${data}`;

        document.getElementById('shareLink').value = url;
        document.getElementById('shareModal').style.display = 'flex';
    }

    closeShareModal() {
        document.getElementById('shareModal').style.display = 'none';
    }

    copyShareLink() {
        const input = document.getElementById('shareLink');
        input.select();
        document.execCommand('copy');
        this.showToast('Link copied to clipboard!', 'success');
    }

    checkUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const tripData = params.get('trip');

        if (tripData) {
            try {
                const data = JSON.parse(decodeURIComponent(tripData));
                this.activeTrip = new Trip(data);
                this.showActiveTripView();
                this.renderActiveTripView();
                this.renderDestinationsOnMap();
                this.showToast('Trip loaded from shared link!', 'info');
            } catch (error) {
                console.error('Error loading shared trip:', error);
                this.showToast('Failed to load shared trip', 'error');
            }
        }
    }

    // ===== UI Helpers =====
    showLoading() {
        document.getElementById('loadingIndicator').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingIndicator').style.display = 'none';
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';

        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

// ===== Initialize Application =====
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TripPlannerApp();
});
