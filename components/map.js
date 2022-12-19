import { useState, useMemo, useCallback, useRef } from "react";
import { GoogleMap, Marker, DirectionsRenderer, Circle, MarkerClusterer} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";


function Map() {

  const [office, setOffice] = useState();
  const [directions, setDirections] = useState();
  const center = useMemo(() => ({ lat: 43, lng: -80 }), []);
  const mapRef = useRef();
  const options = useMemo(
    () => ({
      mapId: "80c16bab8cea4c57",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  const onLoad = useCallback(map => (mapRef.current = map), []);
  const houses = useMemo(() => {
    if (office) return generateHouses(office);
  }, [office]);

  const getDirections = (position) => {
    if (!office){
      return
    }
    else{
      const service = new google.maps.DirectionsService();
      service.route(
        {
          origin: position,
          destination: office,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === "OK" && result){
            setDirections(result);
          }
        }
      )
    }
  }

  return (
    <div className="container">
      <div className="controls">
        <h1>Commute?</h1>
        <Places setOffice={(location) => {
          console.log(location)
          setOffice(location);
          mapRef.current?.panTo(location);
        } } 
        />
        {!office && <p> Enter office address</p>}
        {directions && <Distance leg={directions.routes[0].legs[0]} />}
      </div>
      <div className="map" >
        <GoogleMap 
          zoom={10} 
          center={center} 
          mapContainerClassName="map-container"
          onLoad={onLoad}
          options={options}
        >

          {directions &&
            <DirectionsRenderer directions={directions} options={{
              polylineOptions: {
                zIndex:50,
                strokeColor: "#00d9ff"
              }
            }}/>
          }

          {office && (
            <>
              <Marker 
                position={office}
              />

              <MarkerClusterer>
                {(clusterer) => (
                  houses.map((house) => (<Marker key={house.lat} position={house} clusterer={clusterer}
                    onClick={()=> {
                      getDirections(house);
                    }}  />) )
                )}
              </MarkerClusterer>

              <Circle center={office} radius={15000} options={closeOptions}/>
              <Circle center={office} radius={30000} options={middleOptions}/>
              <Circle center={office} radius={45000} options={farOptions}/>
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  )
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};

const generateHouses = (position) => {
  const _houses = [];
  for (let i = 0; i < 100; i++) {
    const direction = Math.random() < 0.5 ? -2 : 2;
    _houses.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }
  return _houses;
};

export default Map;