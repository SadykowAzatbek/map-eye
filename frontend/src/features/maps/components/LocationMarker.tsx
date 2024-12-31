import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import {Icon, LatLng} from 'leaflet';
import { Button } from '@mui/material';
import locationImg from '../../../../public/location.png';

const LocationMarker = () => {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [trigger, setTrigger] = useState(false);

  const map = useMapEvents({
    click() {
      if (trigger) {
        map.locate();
      }
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      setTrigger(false); // Сбросить триггер после нахождения местоположения
    },
  });

  const handleButtonClick = () => {
    if (position) {
      setPosition(null); // Убирает маркер, если он уже установлен
    } else {
      setTrigger(true);
      map.locate();
    }
  };

  const customIcon = new Icon({
    iconUrl: locationImg,
    iconSize: [40, 35],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [50, 41],
  });

  return (
    <>
      <Button
        onClick={handleButtonClick}
        sx={{
          mt: 9,
          ml: 2,
          zIndex: 400,
          minWidth: 'auto',
          border: position ? '1px solid #000' : '1px solid rgba(0, 0, 0, 0.2)',
          p: 1,
          borderRadius: '40px',
          background: '#fff',
        }}
      >
        <img
          src={locationImg}
          alt="Dinamic img"
          title="Мое местоположение"
          style={{
            width: '33px',
            height: '30px',
          }}
        />
      </Button>
      {position && (
        <Marker position={position} icon={customIcon}>
          <Popup>Ваше местоположение</Popup>
        </Marker>
      )}
    </>
  );
};

export default LocationMarker;
