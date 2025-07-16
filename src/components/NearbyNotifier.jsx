import React, { useEffect, useState, useRef } from "react";

// Mock toast system since react-toastify isn't available
const toast = {
  info: (content, options = {}) => {
    const toastElement = document.createElement("div");
    toastElement.className = "toast-notification";
    toastElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #007bff;
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      max-width: 300px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: slideIn 0.3s ease-out;
    `;

    if (typeof content === "function") {
      const closeToast = () => {
        toastElement.style.animation = "slideOut 0.3s ease-in";
        setTimeout(() => toastElement.remove(), 300);
      };
      toastElement.innerHTML = "";
      const contentElement = content({ closeToast });
      if (typeof contentElement === "object" && contentElement.props) {
        toastElement.innerHTML = contentElement.props.children;
      } else {
        toastElement.appendChild(contentElement);
      }
    } else {
      toastElement.innerHTML = content;
    }

    document.body.appendChild(toastElement);

    // Add CSS for animations
    if (!document.querySelector("#toast-styles")) {
      const style = document.createElement("style");
      style.id = "toast-styles";
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // Auto close after specified time
    const autoClose = options.autoClose || 5000;
    if (autoClose) {
      setTimeout(() => {
        if (toastElement.parentNode) {
          toastElement.style.animation = "slideOut 0.3s ease-in";
          setTimeout(() => toastElement.remove(), 300);
        }
      }, autoClose);
    }
  },
};

export default function NearbyNotifier() {
  const token = sessionStorage.getItem("jwt");
  const [isEnabled, setIsEnabled] = useState(true);
  const [lastNotificationTime, setLastNotificationTime] = useState(null);
  const [nearbyCount, setNearbyCount] = useState(0);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Create notification sound
  const playNotificationSound = () => {
    try {
      // Create a simple notification sound using Web Audio API
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Frequency in Hz
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Audio not supported or blocked");
    }
  };

  const fetchNearby = async () => {
  if (!isEnabled) return;

  try {
    const token = sessionStorage.getItem("jwt");
    const res = await fetch("http://localhost:3000/places/nearby?radius=10", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
console.log(data.places);

    if (data?.places?.length) {
      setNearbyCount(data.places.length);
      setLastNotificationTime(new Date().toLocaleTimeString());

      console.log(`📍 Notification: ${data.places.length} nearby places found.`);

      playNotificationSound();

      toast.info(
        ({ closeToast }) => (
          <div>
            🔥 {data.places.length} new places near you!
            
          </div>
        ),
        { autoClose: 8000 }
      );
    }
  } catch (err) {
    console.error(" Error fetching nearby places:", err);
  }
};


  useEffect(() => {
    if (!isEnabled) return;

    // Initial fetch
    fetchNearby();

    // Set interval for every 30 minute (60000ms) - you can adjust this
    intervalRef.current = setInterval(fetchNearby,30* 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isEnabled]);

}
