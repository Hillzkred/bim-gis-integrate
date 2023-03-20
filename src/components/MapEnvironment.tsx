import Map from "react-map-gl";
import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

function MapEnvironment() {
  return (
    <Map
      initialViewState={{
        longitude: 35.3981,
        latitude: -10.9819,
        zoom: 3.5,
      }}
      mapLib={maplibregl}
      mapStyle="https://api.maptiler.com/maps/basic/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
    />
  );
}

export default MapEnvironment;
