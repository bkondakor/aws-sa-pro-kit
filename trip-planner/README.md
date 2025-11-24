# Trip Planner - Interactive Map

A fully-featured trip planning application with an interactive map interface built with vanilla JavaScript and Leaflet.js.

## Features

### 🗺️ Interactive Map
- Pan, zoom, and explore the world map
- Click on the map to add destinations
- Visual route display between waypoints
- Automatic map centering to fit all destinations

### 📍 Destination Management
- Add destinations by:
  - Clicking on the map
  - Searching for locations by name
- Remove destinations easily
- Set visit duration for each location
- View detailed information for each stop
- Automatic ordering and numbering

### 🛣️ Route Planning
- Visual route lines connecting destinations
- Automatic distance calculation between points
- Total trip distance and duration
- Clear route option to start over

### 💾 Trip Management
- Create unlimited trip plans
- Save trips to browser storage
- Load and edit existing trips
- Delete trips you no longer need
- Auto-save modified date tracking

### 📤 Export & Share
- **Export as JSON** - Machine-readable format
- **Export as Text** - Human-readable itinerary
- **Share via URL** - Generate shareable link to your trip
- Copy share link to clipboard

### 🎨 User Experience
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Collapsible Side Panel** - More map space when needed
- **Toast Notifications** - Helpful feedback for actions
- **Loading Indicators** - Visual feedback during operations

## Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS custom properties
- **Vanilla JavaScript** - No framework dependencies
- **Leaflet.js** - Interactive map library
- **OpenStreetMap** - Free map tiles
- **Nominatim** - Free geocoding service (OpenStreetMap)
- **LocalStorage API** - Client-side data persistence

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for map tiles and geocoding)

### Installation

1. **Open the Trip Planner**
   - Navigate to `trip-planner/index.html` in your browser
   - Or serve via a local web server

2. **No API Keys Required**
   - Uses free OpenStreetMap services
   - No registration or setup needed

### First Steps

1. **Create Your First Trip**
   - Click "New Trip" button
   - Enter a trip name
   - Add optional description

2. **Add Destinations**
   - **Option 1:** Use the search bar to find locations
   - **Option 2:** Click directly on the map

3. **Customize Your Trip**
   - Set visit duration for each destination
   - Reorder destinations by removing and re-adding
   - View automatic distance and duration calculations

4. **Save Your Trip**
   - Click "Save Trip" to store in browser
   - Access from trip list anytime
   - Edits are automatically tracked

## Usage Guide

### Creating a Trip

1. Click **"+ New Trip"** in the header
2. Enter a **Trip Name** (e.g., "European Adventure")
3. Add a **Description** (optional)
4. Start adding destinations

### Adding Destinations

#### Method 1: Search
```
1. Type location name in search box
2. Click "Search" or press Enter
3. Select from results
4. Destination appears on map and in list
```

#### Method 2: Map Click
```
1. Click anywhere on the map
2. System retrieves location details
3. Destination added automatically
```

### Managing Destinations

- **Set Duration:** Use the hours input for each destination
- **Remove:** Click the trash icon next to any destination
- **View on Map:** Automatically numbered markers
- **Reorder:** Remove and re-add in desired order

### Route Visualization

- Routes automatically draw between consecutive destinations
- Total distance calculated in kilometers
- Clear route with the "Clear Route" button if needed

### Saving & Loading

**Save:**
- Click **"Save Trip"** after making changes
- Confirmation toast appears
- Trip added to trip list

**Load:**
- Click "Back to Trips" to see all saved trips
- Click any trip card to open and edit
- Most recently modified trips appear first

### Export Options

**JSON Export:**
- Machine-readable format
- Import into other applications
- Preserves all trip data including coordinates

**Text Export:**
- Human-readable itinerary
- Includes all destinations with details
- Easy to print or email

### Sharing Trips

1. Click **"Share"** button
2. Shareable URL generated with trip data
3. Click **"Copy"** to copy to clipboard
4. Anyone with the link can view (not edit) your trip

### Dark Mode

- Click the moon/sun icon in header
- Preference saved to browser
- Applies to entire interface

### Mobile Usage

- Side panel becomes full-screen overlay
- Swipe-friendly map controls
- Responsive touch interface
- All features available

## Data Storage

### Browser LocalStorage

All trip data is stored locally in your browser:
- **Trips** - Saved to `localStorage` as JSON
- **Dark Mode Preference** - Saved to `localStorage`
- **Privacy** - Data never leaves your device
- **Persistence** - Data survives page refresh

### Data Structure

```javascript
Trip {
  id: string,
  name: string,
  description: string,
  destinations: [
    {
      id: string,
      name: string,
      location: { lat: number, lng: number },
      address: string,
      duration: number,
      notes: string,
      order: number
    }
  ],
  created: ISO date string,
  modified: ISO date string,
  totalDistance: number (km),
  totalDuration: number (hours)
}
```

## API Services

### Nominatim (Geocoding)

**Search:** `https://nominatim.openstreetmap.org/search`
- Converts place names to coordinates
- Returns up to 5 results
- Free, no API key required

**Reverse Geocode:** `https://nominatim.openstreetmap.org/reverse`
- Converts coordinates to place names
- Provides detailed address information
- Free, no API key required

**Usage Policy:**
- Max 1 request per second
- Include valid User-Agent
- See [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)

### OpenStreetMap Tiles

- Map tiles from OpenStreetMap contributors
- Free to use with attribution
- Zoom levels 0-19
- Global coverage

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Mobile Safari | 14+ | ✅ Full |
| Chrome Mobile | 90+ | ✅ Full |

## Performance

- **Initial Load:** <1s (excluding map tiles)
- **Map Tiles:** Cached by browser
- **Geocoding:** ~500ms per request
- **Route Calculation:** Instant (client-side)
- **Storage Limit:** ~5MB (LocalStorage)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Submit location search |
| Escape | Close modals |

## Troubleshooting

### Search Not Working

**Problem:** Location search returns no results

**Solutions:**
- Check internet connection
- Try different search terms
- Be more or less specific
- Use city, state, country format

### Map Not Loading

**Problem:** Map tiles not displaying

**Solutions:**
- Check internet connection
- Clear browser cache
- Try different browser
- Disable browser extensions

### Trips Not Saving

**Problem:** Trips disappear after refresh

**Solutions:**
- Check browser allows LocalStorage
- Ensure not in Private/Incognito mode
- Check browser storage not full
- Try different browser

### Share Link Too Long

**Problem:** URL exceeds browser limits

**Solutions:**
- Reduce number of destinations
- Shorten trip name/description
- Use Export instead
- Share JSON file directly

## Limitations

- **No Real-Time Routing:** Routes are straight lines, not road-based
- **Offline Mode:** Requires internet for map tiles and search
- **Storage Limit:** Browser LocalStorage ~5MB
- **No Collaboration:** Single-user, local storage only
- **No Navigation:** View-only, not turn-by-turn directions

## Future Enhancements

Potential features for future versions:

- [ ] Real-time routing with OSRM
- [ ] Drag-and-drop destination reordering
- [ ] Photo attachments for destinations
- [ ] Print-friendly itinerary view
- [ ] Multiple route options
- [ ] Cost estimation
- [ ] Weather integration
- [ ] Offline map caching
- [ ] Cloud sync option
- [ ] Collaborative trip planning

## Privacy & Security

- **Local Storage Only:** All data stays on your device
- **No User Accounts:** No registration required
- **No Tracking:** No analytics or tracking scripts
- **No Server:** Client-side only application
- **Open Source:** All code visible and auditable

## Credits

- **Map Tiles:** [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- **Geocoding:** [Nominatim](https://nominatim.openstreetmap.org/)
- **Mapping Library:** [Leaflet.js](https://leafletjs.com/)

## License

This project is part of the AWS SA Pro Kit repository.

## Support

For issues or questions:
1. Check this README
2. Review browser console for errors
3. Try different browser
4. Check internet connection

## Contributing

To contribute improvements:
1. Test thoroughly in multiple browsers
2. Maintain vanilla JavaScript approach
3. Ensure mobile responsiveness
4. Update documentation

---

**Happy Trip Planning! 🗺️✈️🎒**
