import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { forwardRef, useEffect } from "react";
import { AxesHelper, Matrix, Matrix4 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { IFCLoader } from "web-ifc-three";
import { PerspectiveCamera } from "three";
import maplibreGl from "maplibre-gl";
import { Layer, Map } from "react-map-gl";

type Props = {
  matrix: Matrix4;
};

const ThreeFiber = ({ matrix }: Props) => {
  const { gl, camera, scene } = useThree();

  useEffect(() => {
    camera.projectionMatrix = matrix;
  });

  // gl.render(scene, camera);

  return null;
};

export default ThreeFiber;
