import Map, { Layer, LngLatLike, Source } from "react-map-gl";
import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Event } from "three";
import { Canvas, RootState, _roots } from "@react-three/fiber";
import { IFCLoader } from "web-ifc-three";
import { IfcModel } from "web-ifc-three/IFC/BaseDefinitions";
import { IFCModel } from "web-ifc-three/IFC/components/IFCModel";
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
import {
  Stage,
  Sky,
  OrbitControls,
  Box,
  EnvironmentMap,
  Environment,
} from "@react-three/drei";
import { IFCManager } from "web-ifc-three/IFC/components/IFCManager";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";
import * as THREE from "three";
import ThreeFiber from "./components/ThreeFiber";
import CanvasEnv from "./components/CanvasEnv";
import { mat4 } from "gl-matrix";
import maplibreGl, { MercatorCoordinate } from "maplibre-gl";
import { useMapLayer } from "./components/useMapLayer";

export default function App() {
  const { glContext, matrixArray, mapLayer } = useMapLayer();
  const [mapCanvas, setMapCanvas] = useState<HTMLCanvasElement>();
  // const ifcLoader = new IFCLoader();
  // ifcLoader.ifcManager.setupThreeMeshBVH(
  //   computeBoundsTree,
  //   acceleratedRaycast,
  //   disposeBoundsTree
  // );

  // const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
  //   const IfcFileFromEvent = event.target.files as FileList;
  //   const url = URL.createObjectURL(IfcFileFromEvent[0]);
  //   await ifcLoader
  //     .loadAsync(url)
  //     .then((model: SetStateAction<IFCModel | null>) => scene.add(model));
  // };

  return (
    <div>
      <input type="file" />
      <div className="h-screen w-screen">
        {mapLayer && (
          <>
            <Map
              initialViewState={{
                longitude: 2.0283,
                latitude: 48.9244,
                zoom: 18,
                pitch: 90,
              }}
              mapLib={maplibreGl}
              onLoad={(map) => {
                map.target.addLayer(mapLayer);
                const canvas = map.target.getCanvas();
                setMapCanvas(canvas);
                const container = map.target.getContainer();
                console.log(canvas);
              }}
              mapStyle="https://api.maptiler.com/maps/basic-v2/style.json?key=ZDFWcNAeAKwpseiIpuuj"
            />
            {glContext && (
              <Canvas
                onCreated={(state) => {
                  state.gl.autoClear = false;
                  state.gl.resetState();
                }}
                gl={{
                  antialias: true,
                  context: glContext,
                }}
              >
                <gridHelper />
                <axesHelper args={[20]} />
                {matrixArray && (
                  <>
                    <mesh>
                      <boxGeometry args={[3, 3, 3]} />
                    </mesh>
                    <ThreeFiber matrix={matrixArray} />
                  </>
                )}
              </Canvas>
            )}
          </>
        )}
      </div>
    </div>
  );
}
// {matrixArray && (
//           <Canvas gl={{ canvas: mapCanvas, context: glContext }} shadows>
//           <EnvironmentMap background={"only"} />
//           <ThreeFiber matrix={matrixArray} />
//           <axesHelper args={[10]} renderOrder={3} />
//           <ambientLight intensity={0.5} />
//           <directionalLight position={[0, -700, 600]} />
//           </Canvas>
//         )}

// const modelOrigin: LngLatLike = [2.0283, 48.9244];
// const modelAltitude = 0;
// const modelRotate = [Math.PI / 2, 0, 0];

// const modelAsMercatorCoordinate: MercatorCoordinate =
//   maplibreGl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);
// const modelTransform: any = {
//   translateX: modelAsMercatorCoordinate.x,
//   translateY: modelAsMercatorCoordinate.y,
//   translateZ: modelAsMercatorCoordinate.z,
//   rotateX: modelRotate[0],
//   rotateY: modelRotate[1],
//   rotateZ: modelRotate[2],
//   scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
// };

// // const camera = new PerspectiveCamera();
// // const scene = new Scene();
// // let renderer: WebGLRenderer;

// function setupGlContext(a: maplibregl.Map, b: WebGLRenderingContext) {
//   return new Promise((res) => {
//     res({ map: a, gl: b });
//   });
// }

// function setupMatrix(a: Matrix4, b: Matrix4) {
//   return new Promise((res) => {
//     res({ m: a, l: b });
//   });
// }

// const handleOnAdd = (map: maplibregl.Map, gl: WebGLRenderingContext) => {
//   console.log("I'm rendered first");
//   setupGlContext(map, gl).then((res) => {
//     const newCanvas = map.getCanvas();
//     setMapCanvas(newCanvas);
//     setGlContext(gl);
//   });
// };

// const handleRender = (gl: WebGLRenderingContext, matrix: mat4) => {
//   const rotationX = new Matrix4().makeRotationAxis(
//     new Vector3(1, 0, 0),
//     modelTransform.rotateX
//   );
//   const rotationY = new Matrix4().makeRotationAxis(
//     new Vector3(0, 1, 0),
//     modelTransform.rotateY
//   );
//   const rotationZ = new Matrix4().makeRotationAxis(
//     new Vector3(0, 0, 1),
//     modelTransform.rotateZ
//   );
//   const m = new Matrix4().fromArray(matrix);
//   const l = new Matrix4()
//     .makeTranslation(
//       modelTransform.translateX,
//       modelTransform.translateY,
//       modelTransform.translateZ
//     )
//     .scale(
//       new Vector3(
//         modelTransform.scale,
//         -modelTransform.scale,
//         modelTransform.scale
//       )
//     )
//     .multiply(rotationX)
//     .multiply(rotationY)
//     .multiply(rotationZ);
//   setupMatrix(m, l).then((matrix) => {
//     setMatrixArray(m.multiply(l));
//   });
// };
