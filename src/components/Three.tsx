import { Canvas } from "@react-three/fiber";
import React from "react";
import { useRef } from "react";
import { IFCLoader } from "web-ifc-three";

export default function Three() {
  const meshRef = useRef();

  return (
    <Canvas>{meshRef.current && <primitive object={meshRef.current} />}</Canvas>
  );
}
