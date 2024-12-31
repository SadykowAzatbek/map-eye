import { MapContainer, TileLayer } from 'react-leaflet';
import LocationMarker from './components/LocationMarker.tsx';

const Map = () => {
  // const searchStreet = async (query: string) => {
  //   const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`);
  //   const data = await response.json();
  //   console.log(data);
  // };
  //
  // void searchStreet('Москва');

  const position: [number, number] = [55.7505412, 37.6174782];

  return (
    <>
      <MapContainer
        center={position}
        zoom={20}
        minZoom={5}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>
    </>
  );
};

export default Map;
