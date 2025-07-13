import React, { useEffect, useState } from "react";
import axios from "axios";
import Hero from "./Hero";
import AboutUs from "./AboutUs";
import TopRatedPlacesHome from "./TopRatedPlacesHome";
import UpCommingEvents from "./UpCommingEvents";
import RecommendedPlaces from "./RecommendedPlaces";

export default function Home() {
  const [places, setPlaces] = useState([]);
  const [events, setEvents] = useState([]);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");

    const fetchTopRatedPlaces = axios.get("http://localhost:3000/places/top");
    const fetchEvents = axios.get("http://localhost:3000/events/eventsinHome");
    const fetchRecommended = axios.get("http://localhost:3000/places/suggested", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    Promise.all([fetchTopRatedPlaces, fetchEvents, fetchRecommended])
      .then(([placesRes, eventsRes, recommendedRes]) => {
        setPlaces(placesRes.data);
        setEvents(eventsRes.data);
        setRecommended(recommendedRes.data.places);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  return (
    <>
      {/* navbar */}

      {/* hero */}
      <Hero />

      {sessionStorage.getItem("jwt") && (
        <RecommendedPlaces recommended={recommended} />
      )}

      {places.length > 0 && <TopRatedPlacesHome places={places} />}

      {events.length > 0 && <UpCommingEvents events={events} />}

      {/* about us */}
      <AboutUs />


      {/* footer */}
    </>
  );
}
