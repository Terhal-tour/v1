import React, { useEffect, useState } from "react";
import axios from "axios";
import Hero from "./Hero";
import AboutUs from "./AboutUs";
import TopRatedPlacesHome from "./TopRatedPlacesHome";
import UpCommingEvents from "./UpCommingEvents";
import RecommendedPlaces from "./RecommendedPlaces";
import Spinner from "./Spinner";

export default function Home() {
  const [places, setPlaces] = useState([]);
  const [events, setEvents] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const token = sessionStorage.getItem("jwt");
    Promise.all([
      fetch("http://localhost:3000/places/top").then((res) => res.json()),
      fetch("http://localhost:3000/events/eventsinHome").then((res) => res.json()),
      fetch("http://localhost:3000/places/suggested", {
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

      {sessionStorage.getItem("jwt") && (
        <RecommendedPlaces recommended={recommended} />
      )}

      {places.length > 0 && <TopRatedPlacesHome places={places} />}
      {events.length > 0 && <UpCommingEvents events={events} />}
      <AboutUs />
    </>
  );
}
