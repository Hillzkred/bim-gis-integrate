import Map, { Layer, LngLatLike } from 'react-map-gl';
import maplibregl, { MercatorCoordinate } from 'maplibre-gl';
import { Three } from './ThreeEnv';
import { ChangeEvent, useState } from 'react';
import {
  AmbientLight,
  BoxGeometry,
  Camera,
  DirectionalLight,
  Event,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { IFCLoader } from 'web-ifc-three';

function MapEnvironment() {
  const handleUpload = (e: Event) => {
    if (e.target) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const urlString = url.toString();
    }
  };

  // const three: any = Three();

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

  const scene = new Scene();
  const camera = new Camera();
  const ifcLoader = new IFCLoader();
  let renderer: WebGLRenderer;

  const handleOnAdd = (map: mapboxgl.Map, gl: WebGLRenderingContext) => {
    const lightColor = 0xffffff;
    const ambientLight = new AmbientLight(lightColor, 0.2);
    scene.add(ambientLight);
    const directionalLight = new DirectionalLight(lightColor, 0.9);
    directionalLight.position.set(0, -700, 600).normalize();
    scene.add(directionalLight);
    const directionalLight2 = new DirectionalLight(lightColor, 0.9);
    directionalLight2.position.set(0, 700, 600).normalize();
    scene.add(directionalLight2);
    const geometry = new BoxGeometry(10, 10, 10);
    const material = new MeshBasicMaterial({ blendEquationAlpha: 2 });
    const cube = new Mesh(geometry, material);
    scene.add(cube);
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
        <Layer
          id='3d-building'
          type='custom'
          renderingMode='3d'
          render={handleRender}
          onAdd={handleOnAdd}
        />
      </Map>
    </>
  );
}

export default MapEnvironment;
