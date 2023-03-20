import { Canvas } from "@react-three/fiber";
import React, { useEffect } from "react";
import { useRef } from "react";
import { IFCLoader } from "web-ifc-three";
import { IFCModel } from "web-ifc-three/IFC/components/IFCModel";

export default function ThreeEnv() {
  const meshRef = useRef({});

  useEffect(() => {
    const ifcLoader = new IFCLoader();
    ifcLoader.load("/sample.ifc", (ifc) => {
      meshRef.current = ifc;
    });
  }, []);

  return (
    <Canvas>{meshRef.current && <primitive object={meshRef.current} />}</Canvas>
  );
}
