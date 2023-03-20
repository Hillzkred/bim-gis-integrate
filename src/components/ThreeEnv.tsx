import { Canvas } from "@react-three/fiber";
import React, { useEffect } from "react";
import { useRef } from "react";
import { IFCLoader } from "web-ifc-three";
import { OrbitControls } from "@react-three/drei";
import maplibreGl, { LngLatLike } from "maplibre-gl";

type Props = {
  lng: number;
  lat: number;
};
export default function ThreeEnv({ lng, lat }: Props) {
  const meshRef = useRef({});

  useEffect(() => {
    const modelOrigin: LngLatLike = [lng, lat];
    console.log(modelOrigin);
    const modelAltitude = 0;
    const modelRotate = [Math.PI / 2, 0.72, 0];

    const modelAsMercatorCoordinate = maplibreGl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    );

    const modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
    };

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
      <directionalLight />
      <mesh matrix={[]}>
        <primitive object={meshRef.current} />
      </mesh>
    </Canvas>
  );
}
