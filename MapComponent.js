import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import { Box, Text, Badge, VStack } from '@chakra-ui/react';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
  overflow: 'hidden'
};

const center = {
  lat: -26.2041, // Default: Johannesburg, South Africa
  lng: 28.0473,
};

function MapComponent({ role = 'recycler' }) {
  const [userLocation, setUserLocation] = useState(null);
  const [recyclingLocations, setRecyclingLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [transportProviders, setTransportProviders] = useState([]);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          
          // Update location if user is a transport provider
          if (role === 'transport') {
            updateTransportLocation(position.coords.latitude, position.coords.longitude);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [role]);

  useEffect(() => {
    // Fetch recycling locations and transport providers
    const fetchLocations = async () => {
      try {
        const [locationsRes, transportRes] = await Promise.all([
          axios.get('http://localhost:5000/api/recycling/locations'),
          axios.get('http://localhost:5000/api/transport/providers')
        ]);
        setRecyclingLocations(locationsRes.data);
        setTransportProviders(transportRes.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchLocations, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateTransportLocation = async (lat, lng) => {
    try {
      await axios.post('http://localhost:5000/api/transport/location', {
        lat,
        lng,
      });
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  return (
    <Box borderWidth={1} borderRadius="lg" overflow="hidden">
      <LoadScript googleMapsApiKey="AIzaSyB2jEcaYhVy7J0uRJ5jf3wG6m-si1BJja4">
        <GoogleMap 
          mapContainerStyle={containerStyle} 
          center={userLocation || center} 
          zoom={12}
          options={{
            styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }],
            fullscreenControl: true,
            zoomControl: true
          }}
        >
          {userLocation && <Marker 
            position={userLocation} 
            icon={{
              url: role === 'transport' ? '/icons/truck.png' : '/icons/user.png',
              scaledSize: { width: 32, height: 32 },
            }}
          />}

          {recyclingLocations.map((location) => (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              icon={{
                url: '/icons/recycling.png',
                scaledSize: { width: 32, height: 32 },
              }}
              onClick={() => setSelectedLocation(location)}
            />
          ))}

          {transportProviders.map((provider) => (
            <Marker
              key={provider.id}
              position={{ lat: provider.lat, lng: provider.lng }}
              icon={{
                url: '/icons/truck.png',
                scaledSize: { width: 32, height: 32 },
              }}
            />
          ))}

          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <VStack align="start" spacing={2} p={2}>
                <Text fontWeight="bold">{selectedLocation.name}</Text>
                <Badge colorScheme="green">{selectedLocation.type}</Badge>
                <Text fontSize="sm">{selectedLocation.address}</Text>
                <Text fontSize="sm">Status: {selectedLocation.status}</Text>
              </VStack>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
}

export default MapComponent;