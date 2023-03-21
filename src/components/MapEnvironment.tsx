import Map, { LngLatLike } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import ThreeEnv from "./ThreeEnv";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function MapEnvironment() {
  return (
    <Map
      initialViewState={{
        longitude: 2.0283,
        latitude: 48.9244,
        zoom: 18,
        pitch: 90,
      }}
      mapLib={maplibregl}
      mapStyle="https://api.maptiler.com/maps/basic/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
    >
      <Canvas>
        <ambientLight intensity={0.5} />
        <gridHelper />
        <directionalLight />
        <ThreeEnv lng={2.0283} lat={48.9244} />
      </Canvas>
    </Map>
  );
}

export default MapEnvironment;
