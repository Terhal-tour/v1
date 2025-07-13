import React, { useEffect, useState } from "react";
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
    fetch("http://localhost:3000/places/top")
      .then((res) => res.json())
      .then((data) => setPlaces(data))
      .catch((err) => console.error("Error fetching places:", err));

    fetch("http://localhost:3000/events/eventsinHome")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((err) => console.error("Error fetching events:", err));

fetch("http://localhost:3000/places/suggested", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((res) => res.json())
  .then((data) => {
    setRecommended(data.places);
  })
  .catch((err) => console.error("Error fetching recommended places:", err));
  }, []);
  console.log(events);

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
      {/* final component */}

      {/* footer */}
    </>
  );
}
