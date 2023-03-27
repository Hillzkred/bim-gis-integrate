import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { forwardRef, useEffect } from 'react';
import { AxesHelper, Matrix } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { IFCLoader } from 'web-ifc-three';
import { PerspectiveCamera } from 'three';
type Props = {
  matrix?: Matrix;
  context?: WebGLRenderingContext;
};

const ThreeFiber = ({ matrix, context }: Props) => {
  const { gl, camera } = useThree();
  // const axes = new AxesHelper(10);
  // axes.renderOrder = 3;
  // scene.add(axes);

  // console.log('Fiber Rendered');
  // gl.autoClear = false;
  camera.projectionMatrix = matrix;
  gl.resetState();
  // gl.render(scene, camera);
  return null;
};

export default ThreeFiber;
