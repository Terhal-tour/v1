import React, { useEffect, useState } from "react";
//import axios from "axios";
import Hero from "./Hero";
import AboutUs from "./AboutUs";
import TopRatedPlacesHome from "./TopRatedPlacesHome";
import UpCommingEvents from "./UpCommingEvents";
import RecommendedPlaces from "./RecommendedPlaces";
import Spinner from "./Spinner";
import "./../css/home.css";
import NearbyNotifier from "./NearbyNotifier";
import GeoLocation from "./GeoLocation";
import NearbyPlaces from "./NearbyPlaces";

export default function Home() {
  const [places, setPlaces] = useState([]);
  const [events, setEvents] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearByPlaces, setNearByPlaces] = useState([]);
  // [TODO WILL BE ADDED FROM LOGIN]
  // sessionStorage.setItem('jwt',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmUxZDg4MWZiMmMwNTdkNGRmZDNmZCIsImlhdCI6MTc1MjU2NDYzNiwiZXhwIjoxNzUzMTY5NDM2fQ.Q3aehdOSEDzWM11CYDz2CSwvoDI_gn14klCQzSWreGo")
  useEffect(() => {
    let isMounted = true;
    const token = sessionStorage.getItem("jwt");
    Promise.all([
      fetch("https://-mu-ten-mu-ten-22ercel.app/places/top").then((res) => res.json()),
      fetch("https://-mu-ten-mu-ten-22ercel.app/events/eventsinHome").then((res) =>
        res.json()
      ),
      fetch("https://-mu-ten-mu-ten-22ercel.app/places/suggested", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
    ])
      .then(([placesData, eventsData, recommendedData]) => {
        if (isMounted) {
          setPlaces(placesData);
          setEvents(eventsData);
          setRecommended(recommendedData.places || []);
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
          <RecommendedPlaces recommended={recommended} />
        </>
      )}

      {places.length > 0 && <TopRatedPlacesHome places={places} />}
      {events.length > 0 && <UpCommingEvents events={events} />}
      {sessionStorage.getItem("jwt") && <NearbyPlaces />}
      <AboutUs />
    </>
  );
}
