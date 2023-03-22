import { useState, useEffect } from "react";

import {
  PerspectiveCamera,
  Scene,
  DirectionalLight,
  AmbientLight,
  Vector3,
  Matrix4,
  WebGLRenderer,
  // Box3,
  AxesHelper,
} from "three";

import maplibregl, { LngLatLike, MercatorCoordinate } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { IFCLoader } from "web-ifc-three";
import { IfcModel } from "web-ifc-three/IFC/BaseDefinitions";

export const Three = () => {
  const [_customLayer, setCustomlayer]: any = useState(null);

  useEffect(() => {
    const modelOrigin: LngLatLike = [2.0283, 48.9244];
    const modelAltitude = 0;
    const modelRotate = [Math.PI / 2, 0, 0];

    const modelAsMercatorCoordinate: MercatorCoordinate =
      maplibregl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);
    const modelTransform: any = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
    };

    const customLayer: any = {
      id: "3d-model",
      type: "custom",
      renderingMode: "3d",
      onAdd: function (map: any, gl: any) {
        this.camera = new PerspectiveCamera();
        this.scene = new Scene();

        const axes = new AxesHelper(10);
        axes.renderOrder = 3;
        this.scene.add(axes);

        // create three.js lights to illuminate the model
        const lightColor = 0xffffff;
        const ambientLight = new AmbientLight(lightColor, 0.2);
        this.scene.add(ambientLight);

        const directionalLight = new DirectionalLight(lightColor, 0.9);
        directionalLight.position.set(0, -700, 600).normalize();
        this.scene.add(directionalLight);

        const directionalLight2 = new DirectionalLight(lightColor, 0.9);
        directionalLight2.position.set(0, 700, 600).normalize();
        this.scene.add(directionalLight2);

        const ifcLoader = new IFCLoader();

        ifcLoader.ifcManager.setWasmPath("/");
        ifcLoader.load("/sample.ifc", (model) => {
          this.scene.add(model);
        });

        this.map = map;

        this.renderer = new WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true,
        });

        this.renderer.autoClear = false;
      },
      render: function (gl: any, matrix: any) {
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

        this.camera.projectionMatrix = m.multiply(l);
        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
      },
    };
    setCustomlayer(customLayer);
  }, []);

  return _customLayer;
};
