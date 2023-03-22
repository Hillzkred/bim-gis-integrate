import Map, { Layer, LngLatLike } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { Three } from "./ThreeEnv";
import { ChangeEvent, useEffect, useState } from "react";
import { Event } from "three";
import { Canvas } from "@react-three/fiber";
import { IFCLoader } from "web-ifc-three";
import { IfcModel } from "web-ifc-three/IFC/BaseDefinitions";
import { IFCModel } from "web-ifc-three/IFC/components/IFCModel";

function MapEnvironment() {
  const [ifcUrl, setIfcUrl] = useState("");
  const [ifcModel, setIfcModel] = useState<IFCModel>();

  const handleUpload = async (e: Event) => {
    const file = await e.target.files[0];
    const url = URL.createObjectURL(file);
    const urlString = url.toString();
    setIfcUrl(urlString);
  };

  // useEffect(() => {
  //   const ifcLoader = new IFCLoader();
  //   ifcLoader.load("/sample.ifc", (model) => {
  //     console.log(model);
  //     setIfcModel(model);
  //   });
  // }, []);

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
        // onLoad={(map) => {
        //   map.target.addLayer(three);
        // }}
        mapLib={maplibregl}
        mapStyle="https://api.maptiler.com/maps/basic-v2/style.json?key=ZDFWcNAeAKwpseiIpuuj"
      >
        <Layer type="custom" render={(gl, matrix) => {}}>
          <Canvas>
            <mesh>
              <sphereGeometry />
            </mesh>
          </Canvas>
        </Layer>
      </Map>
    </>
  );
}

export default MapEnvironment;
