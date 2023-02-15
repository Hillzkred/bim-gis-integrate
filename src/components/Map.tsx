import maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';

function Map() {
  const mapContainer = useRef<HTMLDivElement>();
  const map = useRef(null);
  const [lng] = useState(2.0283);
  const [lat] = useState(48.9244);
  const [zoom] = useState(14);
  const [pitch] = useState(60);
  const [API_KEY] = useState(
    'https://api.maptiler.com/maps/basic/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL'
  );
  const [coordinate, setCoordinate] = useState([48.9244, 2.0283]);
  const [rotate, setRotate] = useState([Math.PI / 2, 0, 0]);
  const [altitude, setAltitude] = useState(0);

  useEffect(() => {
    if (map.current) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL`,
      center: [lng, lat],
      zoom: zoom,
      antialias: true,
      pitch: pitch,
    });
  });

  // parameters to ensure the model is georeferenced correctly on the map
  const modelOrigin = coordinate;
  const modelAltitude = altitude;
  const modelRotate = rotate;

  const modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat(
    modelOrigin,
    modelAltitude
  );

  // transformation parameters to position, rotate and scale the 3D model onto the map
  const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    /* Since our 3D model is in real world meters, a scale transform needs to be
       applied since the CustomLayerInterface expects units in MercatorCoordinates.
     */
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
  };

  const customLayer = {
    id: '3d-model',
    type: 'custom',
    renderingMode: '3d',
    onAdd: function (map: HTMLDivElement, gl) {},
  };

  return (
    <div className='relative w-full h-full'>
      <div ref={mapContainer} className='absolute w-full h-full' />
    </div>
  );
}

export default Map;
