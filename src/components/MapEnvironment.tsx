import Map, { Layer, LngLatLike, Source } from 'react-map-gl';
import maplibregl, { MercatorCoordinate } from 'maplibre-gl';
import { Three } from './ThreeEnv';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Event } from 'three';
import { Canvas } from '@react-three/fiber';
import { IFCLoader } from 'web-ifc-three';
import { IfcModel } from 'web-ifc-three/IFC/BaseDefinitions';
import { IFCModel } from 'web-ifc-three/IFC/components/IFCModel';
import ThreeFiber from './ThreeFiber';
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
} from 'three';
import { OrbitControls } from '@react-three/drei';
import { IFCManager } from 'web-ifc-three/IFC/components/IFCManager';
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from 'three-mesh-bvh';

function MapEnvironment() {
  const [ifcUrl, setIfcUrl] = useState('');
  const [mapContainer, setMapContainer] = useState();
  const [glContext, setGlContext] = useState();
  const [ifcModel, setIfcModel] = useState<IFCModel | null>(null);
  const [url, setUrl] = useState('');

  const ifcLoader = new IFCLoader();
  ifcLoader.ifcManager.setupThreeMeshBVH(
    computeBoundsTree,
    acceleratedRaycast,
    disposeBoundsTree
  );

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const IfcFileFromEvent = event.target.files as FileList;
    const url = URL.createObjectURL(IfcFileFromEvent[0]);
    await ifcLoader
      .loadAsync(url)
      .then((model: SetStateAction<IFCModel | null>) => scene.add(model));
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

  const camera = new PerspectiveCamera();
  const scene = new Scene();
  let renderer: WebGLRenderer;

  const handleOnAdd = (map: mapboxgl.Map, gl: WebGLRenderingContext) => {
    const axes = new AxesHelper(10);
    axes.renderOrder = 3;
    scene.add(axes);

    // create three.js lights to illuminate the model
    const lightColor = 0xffffff;
    const ambientLight = new AmbientLight(lightColor, 0.2);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(lightColor, 0.9);
    directionalLight.position.set(0, -700, 600).normalize();
    scene.add(directionalLight);

    const directionalLight2 = new DirectionalLight(lightColor, 0.9);
    directionalLight2.position.set(0, 700, 600).normalize();
    scene.add(directionalLight2);

    // ifcLoader.load('/sample.ifc', (model) => {
    //   scene.add(model);
    // });

    renderer = new WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });
    renderer.autoClear = false;
  };

  const handleRender = (gl: WebGLRenderingContext, matrix: number[]) => {
    const rotationX = new Matrix4().makeRotationAxis(
      new Vector3(1, 0, 0),
      modelTransform.rotateX
    );
    const rotationY = new Matrix4().makeRotationAxis(
      new Vector3(0, 1, 0),
      modelTransform.rotateY
    );
    const rotationZ = new Matrix4().makeRotationAxis(
      new Vector3(0, 0, 1),
      modelTransform.rotateZ
    );

    const m = new Matrix4().fromArray(matrix);
    const l = new Matrix4()
      .makeTranslation(
        modelTransform.translateX,
        modelTransform.translateY,
        modelTransform.translateZ
      )
      .scale(
        new Vector3(
          modelTransform.scale,
          -modelTransform.scale,
          modelTransform.scale
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);

    camera.projectionMatrix = m.multiply(l);
    renderer.resetState();
    renderer.render(scene, camera);
  };

  // const three: any = Three();

  return (
    <>
      <input type='file' onChange={handleUpload} />
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
        mapStyle='https://api.maptiler.com/maps/basic-v2/style.json?key=ZDFWcNAeAKwpseiIpuuj'
      >
        <Canvas camera={{ position: [10, 10, 20] }}>
          <gridHelper />
          <OrbitControls />
          <Layer
            type='custom'
            id='3d-building'
            renderingMode='3d'
            onAdd={handleOnAdd}
            render={handleRender}
          />
        </Canvas>
      </Map>
    </>
  );
}

export default MapEnvironment;
