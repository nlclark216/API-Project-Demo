// frontend/src/components/Maps/Maps.js
import {memo} from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  maxWidth: '400px',
  height: '300px',
  borderRadius: '4px'
};


const Maps = memo(({ apiKey, center }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        />
      )}
    </>
  );
});

Maps.displayName = 'Maps';

export default Maps