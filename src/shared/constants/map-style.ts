// Clean, light Google Maps style: hides POI/transit clutter and softens the
// palette toward the brand (greenish water, light land, white roads). Shared by
// the dashboard mini-map and the charging-stations map.
export const mapStyle = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f3f5f1' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#cfe8da' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#f4f4f2' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#7a7a76' }] },
]
