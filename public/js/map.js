mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

// Ensure the marker gets correct coordinates
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates) // pass as [lng, lat]
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      "<h4>For exact location please contact the owner</h4>"
    )
  )
  .addTo(map);
