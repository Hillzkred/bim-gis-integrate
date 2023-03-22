import Map, { LngLatLike } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { Three } from "./ThreeEnv";
import { ChangeEvent, useState } from "react";
import { Event } from "three";

function MapEnvironment() {
  const handleUpload = (e: Event) => {
    if (e.target) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const urlString = url.toString();
    }
  };

  const three: any = Three();
  return (
    <>
      <input type="file" onChange={handleUpload} />
      <Map
        initialViewState={{
          longitude: 2.0283,
          latitude: 48.9244,
          zoom: 18,
          pitch: 90,
        }}
        onLoad={(map) => {
          map.target.addLayer(three);
        }}
        mapLib={maplibregl}
        mapStyle="https://api.maptiler.com/maps/basic-v2/style.json?key=ZDFWcNAeAKwpseiIpuuj"
      ></Map>
    </>
  );
}

export default MapEnvironment;
