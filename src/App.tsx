import Map from 'react-map-gl';
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ThreeFiber from './components/ThreeFiber';
import maplibreGl from 'maplibre-gl';
import { useCustomLayer } from './components/useCustomLayer';

export default function App() {
  const { glContext, matrixArray, customMapLayer } = useCustomLayer();
  const [mapCanvas, setMapCanvas] = useState<HTMLCanvasElement>();
  // const ifcLoader = new IFCLoader();
  // ifcLoader.ifcManager.setupThreeMeshBVH(
  //   computeBoundsTree,
  //   acceleratedRaycast,
  //   disposeBoundsTree
  // );

  // const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
  //   const IfcFileFromEvent = event.target.files as FileList;
  //   const url = URL.createObjectURL(IfcFileFromEvent[0]);
  //   await ifcLoader
  //     .loadAsync(url)
  //     .then((model: SetStateAction<IFCModel | null>) => scene.add(model));
  // };

  return (
    <div>
      <input type='file' />
      <div className='h-screen w-screen'>
        {customMapLayer && (
          <>
            <Map
              initialViewState={{
                longitude: 2.0283,
                latitude: 48.9244,
                zoom: 18,
                pitch: 90,
              }}
              mapLib={maplibreGl}
              onLoad={(map) => {
                map.target.addLayer(customMapLayer);
                const canvas = map.target.getCanvas();
                setMapCanvas(canvas);
                const container = map.target.getContainer();
                console.log(canvas);
              }}
              mapStyle='https://api.maptiler.com/maps/basic-v2/style.json?key=ZDFWcNAeAKwpseiIpuuj'
            />
            {glContext && (
              <Canvas
                onCreated={(state) => {
                  state.gl.autoClear = false;
                  state.gl.resetState();
                }}
                gl={{
                  canvas: mapCanvas,
                  antialias: true,
                  context: glContext,
                }}
              >
                <gridHelper />
                <axesHelper args={[20]} />
                {matrixArray && (
                  <>
                    <mesh>
                      <boxGeometry args={[3, 3, 3]} />
                    </mesh>
                    <ThreeFiber matrix={matrixArray} />
                  </>
                )}
              </Canvas>
            )}
          </>
        )}
      </div>
    </div>
  );
}
