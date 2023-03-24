import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { AxesHelper, Matrix } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { IFCLoader } from 'web-ifc-three';

type Props = {
  matrix?: Matrix;
  map?: mapboxgl.Map;
};

const ThreeFiber = ({ matrix }: Props) => {
  const { gl: renderer, camera, scene } = useThree();
  // const axes = new AxesHelper(10);
  // axes.renderOrder = 3;
  // scene.add(axes);

  console.log('Fiber Rendered');
  renderer.autoClear = false;
  camera.projectionMatrix = matrix;
  renderer.resetState();
  renderer.render(scene, camera);
  return null;
};

export default ThreeFiber;
