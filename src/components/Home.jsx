import React, { useEffect, useState } from "react";
//import axios from "axios";
import Hero from "./Hero";
import AboutUs from "./AboutUs";
import TopRatedPlacesHome from "./TopRatedPlacesHome";
// import UpCommingEvents from "./UpCommingEvents"; ← تم التعليق عليها
import Spinner from "./Spinner";
import "./../css/home.css";
import NearbyNotifier from "./NearbyNotifier";
import GeoLocation from "./GeoLocation";
import NearbyPlaces from "./NearbyPlaces";
import { useLocation } from "react-router-dom";
import RealTimeRecommendations from "./RealTimeRecommendations";

export default function Home() {
  const [places, setPlaces] = useState([]);
  // const [events, setEvents] = useState([]); ← تم التعليق عليها
  const [loading, setLoading] = useState(true);
  const [nearByPlaces, setNearByPlaces] = useState([]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetch("https://backend-mu-ten-26.vercel.app/places/top").then((res) => res.json()),
      // fetch("https://backend-mu-ten-26.vercel.app/events/eventsinHome").then((res) =>
      //   res.json()
      // ),
    ])
      .then(([placesData /*, eventsData */]) => {
        if (isMounted) {
          setPlaces(placesData);
          // setEvents(eventsData);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) setLoading(false);
        console.error("Error fetching data:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100); // wait for DOM render
      }
    }
  }, [location.state]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Hero />
      {/* {sessionStorage.setItem('jwt','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmUxZDg4MWZiMmMwNTdkNGRmZDNmZCIsImlhdCI6MTc1MjYwOTc0MywiZXhwIjoxNzUzMjE0NTQzfQ.I92EV3CjabhODHWhjn8kA12Wk4Ri1kuBbE7gsuHB0X4')} */}
      {sessionStorage.getItem("jwt") && (
        <>
          <GeoLocation />
          <NearbyNotifier />
        </>
      )}

      {places.length > 0 && <TopRatedPlacesHome places={places} />}
      {/* {events.length > 0 && <UpCommingEvents events={events} />} */}
      {sessionStorage.getItem("jwt") && <NearbyPlaces />}
      <AboutUs />
    </>
  );
}
