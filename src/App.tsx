import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  Skeleton,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer
} from "@react-google-maps/api";
import { useRef, useState } from "react";

const CENTER = {
  lat: 14.834, // Example: somewhere in Bulacan 😆
  lng: 120.933,
};

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(/** @type google.maps.Map */ null)
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.Map | null>(/** @type google.maps.Map */ null);
  const [distance, setDistance] = useState<null | string | undefined>('');
  const [duration, setDuration] = useState<null | string | undefined>('');

  const originRef = useRef<HTMLInputElement>(null)
  const destinationRef = useRef<HTMLInputElement>(null)

  const calculateRoute = async () => {
    if(originRef?.current?.value == '' && destinationRef?.current?.value == '') {
      return;
    }

    if(originRef?.current && destinationRef?.current) {
      const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results?.routes[0]?.legs[0]?.distance?.text)
    setDuration(results?.routes[0]?.legs[0]?.duration?.text)

    console.log('calculate')
    }
    
  }

  const clearRoute = () => {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    if(originRef.current) {
        originRef.current.value = ''
    }
    if(destinationRef.current) {
      destinationRef.current.value = ''
    }
  }
  if (!isLoaded) {
    return <SkeletonText />;
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      bgColor="blue.200"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        <GoogleMap
          center={CENTER}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map: google.maps.Map) => setMap(map)}
        >
          <Marker position={CENTER} />

          {
            directionsResponse && <DirectionsRenderer directions={directionsResponse}  />
          }
        </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius="lg"
        mt={4}
        bgColor="white"
          minW="container.md"
        zIndex="modal"
      >
        <HStack spaceX={4} spaceY={4} >
          <Autocomplete options={{
            
          }}>
            <input type="text" ref={originRef} placeholder="Origin"  required/>
          </Autocomplete>
          <Autocomplete>
            <input type="text" ref={destinationRef} placeholder="Destination"  required/>
          </Autocomplete>
          <ButtonGroup>
            <Button colorScheme="pink" type="submit" onClick={() => calculateRoute()}>
              Calculate Route
            </Button>
            <IconButton aria-label="center back" onClick={clearRoute}  />
          </ButtonGroup>
        </HStack>
        <HStack spaceX={4} spaceY={4} mt={4} justifyContent="space-between">
          <Text style={{
            color: 'black'
          }}>Distance: {distance} </Text>
          <Text style={{
            color: 'black'
          }}>Duration: {duration}</Text>
          <IconButton
            aria-label="center back"
            onClick={() => map!.panTo(CENTER)}
          />
        </HStack>
      </Box>
    </Flex>
  );
}

export default App;
