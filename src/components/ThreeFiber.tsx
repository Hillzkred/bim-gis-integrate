import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { forwardRef, useEffect } from "react";
import { AxesHelper, Matrix } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { IFCLoader } from "web-ifc-three";
import { PerspectiveCamera } from "three";
type Props = {
  matrix?: Matrix;
  context?: any;
};

const ThreeFiber = ({ matrix, context }: Props) => {
  const { gl, camera, scene } = useThree();
  // const axes = new AxesHelper(10);
  // axes.renderOrder = 3;
  // scene.add(axes);

  // console.log('Fiber Rendered');
  // gl.autoClear = false;
  // context(() => {
  //   console.log("processed");
  // });

  camera.projectionMatrix = matrix;
  gl.render(scene, camera);
  // gl.render(scene, camera);
  gl.resetState();
  return null;
};

export default ThreeFiber;
