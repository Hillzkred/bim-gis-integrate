import Map, { LngLatLike } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { Three } from "./ThreeEnv";
import { ChangeEvent, useState } from "react";
import { Event } from "three";

function MapEnvironment() {
  const [ifcUrl, setIfcUrl] = useState("");
  const handleUpload = (e: Event) => {
    if (e.target) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const urlString = url.toString();
      setIfcUrl(urlString);
    }
  };
  console.log(ifcUrl);
  const three: any = Three(ifcUrl);
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
        mapStyle="https://api.maptiler.com/maps/basic/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
      ></Map>
    </>
  );
}

export default MapEnvironment;
