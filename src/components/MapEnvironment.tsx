import Map, { Layer, LngLatLike, Source } from "react-map-gl";
import maplibregl, { MercatorCoordinate } from "maplibre-gl";
import { Three } from "./ThreeEnv";
import { ChangeEvent, useEffect, useState } from "react";
import { Event } from "three";
import { Canvas } from "@react-three/fiber";
import { IFCLoader } from "web-ifc-three";
import { IfcModel } from "web-ifc-three/IFC/BaseDefinitions";
import { IFCModel } from "web-ifc-three/IFC/components/IFCModel";
import ThreeFiber from "./ThreeFiber";
import {
  PerspectiveCamera,
  Scene,
  DirectionalLight,
  AmbientLight,
  Vector3,
  Matrix4,
  WebGLRenderer,
  // Box3,
  AxesHelper,
} from "three";

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

  const modelOrigin: LngLatLike = [2.0283, 48.9244];
  const modelAltitude = 0;
  const modelRotate = [Math.PI / 2, 0, 0];

  const modelAsMercatorCoordinate: MercatorCoordinate =
    maplibregl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);
  const modelTransform: any = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
  };

  const handleLoad = (map: mapboxgl.Map, gl: WebGLRenderingContext) => {
    this.camera = new PerspectiveCamera();
    this.scene = new Scene();

    const axes = new AxesHelper(10);
    axes.renderOrder = 3;
    this.scene.add(axes);

    // create three.js lights to illuminate the model
    const lightColor = 0xffffff;
    const ambientLight = new AmbientLight(lightColor, 0.2);
    this.scene.add(ambientLight);

    const directionalLight = new DirectionalLight(lightColor, 0.9);
    directionalLight.position.set(0, -700, 600).normalize();
    this.scene.add(directionalLight);

    const directionalLight2 = new DirectionalLight(lightColor, 0.9);
    directionalLight2.position.set(0, 700, 600).normalize();
    this.scene.add(directionalLight2);

    const ifcLoader = new IFCLoader();

    ifcLoader.load("/sample.ifc", (model) => {
      this.scene.add(model);
    });

    this.map = map;

    this.renderer = new WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });

    this.renderer.autoClear = false;
  };
  const handleRender = (gl, matrix) => {};

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
        {/* <Layer type="custom" onAdd={handleLoad}/> */}
        <Layer type="custom" render={handleRender}>
          <sphereBufferGeometry />
        </Layer>
      </Map>
    </>
  );
}

export default MapEnvironment;
