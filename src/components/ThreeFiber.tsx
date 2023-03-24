import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { AxesHelper, Matrix } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { IFCLoader } from 'web-ifc-three';

type Props = {
  matrix?: number[];
  map?: mapboxgl.Map;
};

export default function ThreeFiber({ matrix }: Props) {
  // const { scene, gl, camera } = useThree();
  // const axes = new AxesHelper(10);
  // axes.renderOrder = 3;
  // scene.add(axes);

  // gl.autoClear = false;

  // const ifcLoader = new IFCLoader();
  // ifcLoader.load('/sample.ifc', (model) => {
  //   scene.add(model);
  // });
  console.log("I'm being rendered");

  return (
    <Canvas camera={{ position: [5, 3, 5] }}>
      <ambientLight intensity={0.5} />
      <axesHelper args={[10]} renderOrder={3} />
      <mesh
        matrix={{
          fromArray(array) {
            console.log(array);
          },
        }}
      >
        <sphereGeometry />
      </mesh>
    </Canvas>
  );
}
