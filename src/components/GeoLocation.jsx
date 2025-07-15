import React, { useEffect } from 'react';

export default function GeoLocation() {
  useEffect(() => {
    const token = sessionStorage.getItem('jwt');

    if (navigator.geolocation && token) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            await fetch('http://localhost:3000/user/location', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ lat: latitude, lng: longitude }),
            });
          } catch (err) {
            console.error('Error sending location:', err);
          }
        },
        (err) => console.error('Location error:', err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return <div></div>;
}
