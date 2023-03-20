import { Canvas } from "@react-three/fiber";
import React, { useEffect } from "react";
import { useRef } from "react";
import { IFCLoader } from "web-ifc-three";
import { OrbitControls } from "@react-three/drei";

export default function ThreeEnv() {
  const meshRef = useRef({});

  useEffect(() => {
    const ifcLoader = new IFCLoader();
    ifcLoader.load("/sample.ifc", (ifc) => {
      meshRef.current = ifc;
    });
  }, []);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <OrbitControls />
      <gridHelper />
      {meshRef.current && <primitive object={meshRef.current} />}
    </Canvas>
  );
}
