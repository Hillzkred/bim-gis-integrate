import Map, { Layer, LngLatLike } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { Three } from "./ThreeEnv";
import { ChangeEvent, useState } from "react";
import { Event } from "three";

function MapEnvironment() {
  const [ifcUrl, setIfcUrl] = useState("");
  const handleUpload = async (e: Event) => {
    const file = await e.target.files[0];
    const url = URL.createObjectURL(file);
    const urlString = url.toString();
    setIfcUrl(urlString);
  };
  const three: any = Three();
  console.log(ifcUrl);
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
        // onLoad={(map) => {
        //   map.target.addLayer(three);
        // }}
        mapLib={maplibregl}
        mapStyle="https://api.maptiler.com/maps/basic-v2/style.json?key=ZDFWcNAeAKwpseiIpuuj"
      >
        <Layer type="custom" render={(gl, matrix) => {}}>
          <Three />
        </Layer>
      </Map>
    </>
  );
}

export default MapEnvironment;
