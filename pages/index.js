import {useLoadScript } from '@react-google-maps/api'
import Map from '../components/map'

function Home(){

  const {isLoaded} = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries: ["places"],
  });

  if(!isLoaded) {
    return <div>Loading</div>
  }

  return <Map/>;
}

export default Home;