import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import ThreeFiber from "./ThreeFiber";

export default function CanvasEnv() {
  useEffect(() => {}, []);
  return (
    <Canvas
      onCreated={({ gl, scene, camera }) => {
        gl.render(scene, camera);
      }}
    >
      <axesHelper />
    </Canvas>
  );
}
