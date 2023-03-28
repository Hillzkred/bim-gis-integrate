import Map, { Layer, LngLatLike, Source } from "react-map-gl";
import maplibregl, { MercatorCoordinate } from "maplibre-gl";
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
} from "@react-three/drei";
import { IFCManager } from "web-ifc-three/IFC/components/IFCManager";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";
import * as THREE from "three";
import ThreeFiber from "./components/ThreeFiber";

export default function App() {
  const [ifcUrl, setIfcUrl] = useState("");
  // const [mapContainer, setMapContainer] = useState<mapboxgl.Map>();
  const [mapCanvas, setMapCanvas] = useState<HTMLCanvasElement>();
  const [glContext, setGlContext] = useState<WebGLRenderingContext>();
  const [matrixArray, setMatrixArray] = useState<Matrix4>();
  const [getGl, setGetGl] = useState();
  const [ifcModel, setIfcModel] = useState<IFCModel | null>(null);
  const [url, setUrl] = useState("");
  const [threeScene, setThreeScene] = useState<RootState>();
  const [mapState, setMapState] = useState(false);
  const [toggleCanvas, setToggleCanvas] = useState(false);

  useEffect(() => {}, []);
  // console.log(glContext);
  // console.log(mapContainer);
  // console.log(matrixArray);
  // console.log(toggleCanvas);

  const ifcLoader = new IFCLoader();
  ifcLoader.ifcManager.setupThreeMeshBVH(
    computeBoundsTree,
    acceleratedRaycast,
    disposeBoundsTree
  );

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    // const IfcFileFromEvent = event.target.files as FileList;
    // const url = URL.createObjectURL(IfcFileFromEvent[0]);
    // await ifcLoader
    //   .loadAsync(url)
    //   .then((model: SetStateAction<IFCModel | null>) => scene.add(model));
  };

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

  // const camera = new PerspectiveCamera();
  // const scene = new Scene();
  // let renderer: WebGLRenderer;

  function setupGlContext(a: mapboxgl.Map, b: WebGLRenderingContext) {
    return new Promise((res) => {
      res({ map: a, gl: b });
    });
  }

  function setupMatrix(a: Matrix4, b: Matrix4) {
    return new Promise((res) => {
      res({ m: a, l: b });
    });
  }

  const foo = (callback) => {
    const bar = callback();
    setGetGl(bar);
  };

  // const handleOnAdd = (map: mapboxgl.Map, gl: WebGLRenderingContext) => {
  //create three.js lights to illuminate the model
  // const lightColor = 0xffffff;
  // const ambientLight = new AmbientLight(lightColor, 0.2);
  // scene.add(ambientLight);
  // const directionalLight = new DirectionalLight(lightColor, 0.9);
  // directionalLight.position.set(0, -700, 600).normalize();
  // scene.add(directionalLight);
  // const directionalLight2 = new DirectionalLight(lightColor, 0.9);
  // directionalLight2.position.set(0, 700, 600).normalize();
  // scene.add(directionalLight2);
  // const geometry = new THREE.BoxGeometry(1000000, 1000000, 1000000);
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // const cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);
  // ifcLoader.load('/sample.ifc', (model) => {
  //   scene.add(model);
  // });
  // renderer = new WebGLRenderer({
  //   canvas: map.getCanvas(),
  //   context: gl,
  //   antialias: true,
  // });
  // renderer.autoClear = false;
  // };

  // const handleRender = (gl: WebGLRenderingContext, matrix: number[]) => {
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
  //   // camera.projectionMatrix = m.multiply(l);
  //   // renderer.resetState();
  //   // renderer.render(scene, camera);
  //   setupMatrix(m, l).then((matrix) => {
  //     setMatrixArray(matrix.m.multiply(matrix.l));
  //     setToggleCanvas(true);
  //   });
  // };
  let renderProcess;
  return (
    <div>
      <input type="file" onChange={handleUpload} />
      {/* <Canvas
        gl={{
          canvas: mapContainer?.getCanvas(),
          context: glContext,
          antialias: true,
          autoClear: false,
        }}
        camera={{ projectionMatrix: matrixArray }}
      >
        <OrbitControls />
        <axesHelper args={[10]} renderOrder={3} />
        <gridHelper />
        <ambientLight intensity={0.5} />
        <mesh>
        <sphereGeometry />
        </mesh>
      </Canvas> */}
      <div className="h-screen w-screen">
        <Map
          initialViewState={{
            longitude: 2.0283,
            latitude: 48.9244,
            zoom: 18,
            pitch: 90,
          }}
          mapLib={maplibregl}
          mapStyle="https://api.maptiler.com/maps/basic-v2/style.json?key=ZDFWcNAeAKwpseiIpuuj"
        >
          <Layer
            type="custom"
            id="3d-building"
            renderingMode="3d"
            onAdd={(map: mapboxgl.Map, gl: WebGLRenderingContext) => {
              console.log("I'm rendered first");
              () => {
                setGlContext(gl);
              };
              setupGlContext(map, gl).then((res) => {
                const newCanvas = map.getCanvas();
                setMapState(true);
                setMapCanvas(newCanvas);
                // setGlContext(gl);
              });
            }}
            render={(gl: WebGLRenderingContext, matrix: number[]) => {
              console.log("I'm rendered second");
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
              // camera.projectionMatrix = m.multiply(l);
              // renderer.resetState();
              // renderer.render(scene, camera);
              // renderProcess = (callback) => {
              //   callback();
              // };
              setupMatrix(m, l).then((matrix) => {
                setMatrixArray(m.multiply(l));
                setToggleCanvas(true);
              });
            }}
          />
        </Map>
        {matrixArray && (
          <Canvas
            gl={{ canvas: mapCanvas, context: glContext }}
            shadows
            // camera={{ projectionMatrix: matrixArray }}
          >
            <EnvironmentMap background={"only"} />
            <ThreeFiber matrix={matrixArray} context={renderProcess} />
            {/* <perspectiveCamera projectionMatrix={matrixArray} /> */}
            <axesHelper args={[10]} renderOrder={3} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, -700, 600]} />
            <mesh castShadow>
              <boxGeometry args={[10, 10, 10]} />
            </mesh>
          </Canvas>
        )}
      </div>
    </div>
  );
}
