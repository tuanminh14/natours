/*eslint-disable*/

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiMTR0aGFuZzYiLCJhIjoiY2xhYmtwcHd4MDFhMDQwbWl3bnplNmJ0byJ9.5_m4rl03xNWvG6wLKtazcQ';

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/14thang6/clacdxdud000414mp3ce2fekt', // style URL
    // center: [-118.113491, 34.111745], // starting position [lng, lat]
    // zoom: 5, // starting zoom
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const marker = new mapboxgl.Marker().setLngLat(loc.coordinates).addTo(map);

    //Add pop up
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day} : ${loc.description}</p>`)
      .addTo(map);
    //Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, { padding: 100 });
};
