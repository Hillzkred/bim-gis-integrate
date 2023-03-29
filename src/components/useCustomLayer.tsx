import maplibreGl, {
  CustomLayerInterface,
  CustomRenderMethod,
  LngLatLike,
  MercatorCoordinate,
} from 'maplibre-gl';
import { useEffect, useState } from 'react';
import { Vector3, Matrix4 } from 'three';
import { AnyLayer } from 'mapbox-gl';

export const useCustomLayer = () => {
  // interface NewLayer {
  //   id: string;
  //   type: "custom";
  //   renderingMode?: "2d" | "3d" | undefined;
  //   onAdd: (map: maplibregl.Map, gl: WebGLRenderingContext) => void;
  //   render: CustomRenderMethod;
  // }
  const [customMapLayer, setCustomMapLayer] = useState<AnyLayer>();
  const [mapCanvas, setMapCanvas] = useState<HTMLCanvasElement>();
  const [glContext, setGlContext] = useState<WebGLRenderingContext>();
  const [matrixArray, setMatrixArray] = useState<Matrix4>();

  interface ModelTranslation {
    translateX: number;
    translateY: number;
    translateZ: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    scale: number;
  }

  const modelOrigin: LngLatLike = [2.0283, 48.9244];
  const modelAltitude = 0;
  const modelRotate = [Math.PI / 2, 0, 0];

  const modelAsMercatorCoordinate: MercatorCoordinate =
    maplibreGl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);

  const modelTransform: ModelTranslation = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
  };

  useEffect(() => {
    const customLayer: mapboxgl.AnyLayer = {
      type: 'custom',
      id: '3d-building',
      renderingMode: '3d',
      onAdd: (map: mapboxgl.Map, gl: WebGLRenderingContext) => {
        console.log("I'm rendered first");
        const newCanvas = map.getCanvas();
        setMapCanvas(newCanvas);
        setGlContext(gl);
      },
      render: (gl: WebGLRenderingContext, matrix: number[]) => {
        const rotationX = new Matrix4().makeRotationAxis(
          new Vector3(1, 0, 0),
          modelTransform.rotateX
        );
        const rotationY = new Matrix4().makeRotationAxis(
          new Vector3(0, 1, 0),
          modelTransform.rotateY
        );
        const rotationZ = new Matrix4().makeRotationAxis(
          new Vector3(0, 0, 1),
          modelTransform.rotateZ
        );
        const m = new Matrix4().fromArray(matrix);
        const l = new Matrix4()
          .makeTranslation(
            modelTransform.translateX,
            modelTransform.translateY,
            modelTransform.translateZ
          )
          .scale(
            new Vector3(
              modelTransform.scale,
              -modelTransform.scale,
              modelTransform.scale
            )
          )
          .multiply(rotationX)
          .multiply(rotationY)
          .multiply(rotationZ);
        setMatrixArray(m.multiply(l));
      },
    };
    setCustomMapLayer(customLayer);
  }, []);

  return { customMapLayer, glContext, mapCanvas, matrixArray };
};
