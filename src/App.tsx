import { Html, Select } from "@react-three/drei";
import { Line, OrbitControls } from "@react-three/drei/core";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { ChangeEvent, useState } from "react";
import THREE, { BufferGeometry, Object3D } from "three";
import { IFCLoader } from "web-ifc-three";
import { IFCModel } from "web-ifc-three/IFC/components/IFCModel";
import maplibregl from "maplibre-gl";
import MapEnvironment from "./components/MapEnvironment";

function App() {
  const [id, setId] = useState(Number);
  const [ifcModel, setIfcModel] = useState({} as IFCModel);
  const [ifcModelsArray, setIfcModelsArray] = useState(Array<Object3D>);

  const ifcLoader = new IFCLoader();
  const ifc = ifcLoader.ifcManager;

  const handleIfcUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const IfcFileFromEvent = event.target.files as FileList;
    const url = URL.createObjectURL(IfcFileFromEvent[0]);
    ifcLoader.load(url, (ifcModel) => {
      console.log(ifcModel);
      setIfcModel(ifcModel);
      setIfcModelsArray([...ifcModelsArray, ifcModel]);
    });
  };

  const handleIfcClick = (event: ThreeEvent<MouseEvent>) => {
    const index = event.faceIndex as number;
    const ifcObject = event.object as IFCModel;
    const geometry = ifcObject.geometry as BufferGeometry;
    const id = ifc.getExpressId(geometry, index);
    setId(id);
    console.log(id);
  };

  const handlePointerEnter = (event: ThreeEvent<MouseEvent>) => {
    const ifcObject = event.object as IFCModel;
    const modelId = ifcObject.modelID;

    const index = event.faceIndex as number;
    const geometry = ifcObject.geometry as BufferGeometry;
    const id = ifc.getExpressId(geometry, index);
  };
  return (
    <div className="h-screen w-screen">
      <MapEnvironment />{" "}
    </div>
  );
}

export default App;

/*
<ul className="flex bg-slate-600 text-white p-2 ">
  <li>
    <input type="file" name="load" onChange={handleIfcUpload} />
  </li>
  <li>
    <p>ID: {id}</p>
  </li>
</ul>
<div className="w-full h-full">
  <Canvas
    camera={{ fov: 75, near: 0.1, far: 1000, position: [8, 13, 15] }}
    raycaster={{ firstHitOnly: true }}
  >
    <Select box multiple onClick={handleIfcClick}>
      <mesh>
        <primitive object={ifcModel} />
      </mesh>
    </Select>
         <Html>
            <MapEnvironment />
          </Html> 
    <ambientLight intensity={0.5} />
    <directionalLight position={[0, 10, 0]} color={0xffffff} />
    <OrbitControls autoRotate autoRotateSpeed={0.05} makeDefault />
    <gridHelper args={[50, 50]} />
  </Canvas>
</div>
*/
