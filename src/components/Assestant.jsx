import React, { useState } from "react";
import "./../css/assistant.css";
import { NavLink } from "react-router-dom";

export default function Assistant() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 0,
      text: "Hello there! I'm Terhal, your AI travel assistant. I'm here to help you plan your perfect trip to Egypt. Whether you're looking for historical sites, cultural experiences, or hidden gems, I've got you covered. What are your interests for this trip?",
      sender: "assistant",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: inputValue,
        sender: "user",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsTyping(true);

      try {
        const token = sessionStorage.getItem("jwt");
        const response = await fetch(
          "https://backend-mu-ten-26.vercel.app/assestant/plan-trip",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              message: inputValue,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const assistantMessage = {
            id: messages.length + 2,
            text: "",
            sender: "assistant",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            type: "itinerary",
            itinerary: data,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          const errorMessage = {
            id: messages.length + 2,
            text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
            sender: "assistant",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            type: "text",
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } catch (error) {
        const errorMessage = {
          id: messages.length + 2,
          text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
          sender: "assistant",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: "text",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-solid px-4 sm:px-6 py-3 bg-[var(--papyrus-cream)]/80 backdrop-blur-sm border-b-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[var(--nile-indigo)] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[var(--gold-accent)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 11c-1.333 0-4-1.667-4-5s1.667-4 4-4 4 1.667 4 4-2.667 5-4 5zm0 0c-2.333 0-7 1.167-7 3.5V18h14v-3.5c0-2.333-4.667-3.5-7-3.5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[var(--papyrus-cream)]"></span>
            </div>
            <div>
              <h2 className="text-[var(--nile-indigo)] text-lg font-bold leading-tight">
                Terhal
              </h2>
              <p className="text-xs text-green-600 font-semibold">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/" className="flex items-center justify-center rounded-full h-10 w-10 bg-transparent text-[var(--nile-indigo)] hover:bg-[var(--nile-indigo)]/10">
              <svg
                fill="blue"
                height="24px"
                viewBox="0 0 256 256"
                width="24px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144ZM48,96a32,32,0,1,0,32,32A32,32,0,0,0,48,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,48,144Zm160-48a32,32,0,1,0-32-32A32,32,0,0,0,208,96Zm0-16a16,16,0,1,1-16,16A16,16,0,0,1,208,80Z"></path>
              </svg>
            </NavLink>
          </div>
        </header>
        <main className="flex-1 pt-24 pb-28 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                {message.sender === "assistant" && (
                  <div className="w-9 h-9 rounded-full bg-[var(--nile-indigo)] flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-[var(--gold-accent)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 11c-1.333 0-4-1.667-4-5s1.667-4 4-4 4 1.667 4 4-2.667 5-4 5zm0 0c-2.333 0-7 1.167-7 3.5V18h14v-3.5c0-2.333-4.667-3.5-7-3.5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                )}

                <div
                  className={`flex flex-col gap-1 ${
                    message.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`${
                      message.sender === "assistant"
                        ? "bg-[var(--nile-indigo)] text-[var(--papyrus-cream)] rounded-xl rounded-tl-none"
                        : "bg-[var(--gold-accent)] text-white rounded-xl rounded-tr-none"
                    } px-4 py-3 max-w-lg`}
                  >
                    {message.type === "text" ? (
                      <p className="text-sm font-medium leading-relaxed">
                        {message.text}
                      </p>
                    ) : (
                      <div className="text-sm font-medium leading-relaxed">
                        <p className="mb-4">
                          Here's your personalized itinerary:
                        </p>
                        <div className="space-y-4">
                          {console.log(message)}
                          {message.itinerary.error ? (
                            <div className="text-sm text-red-500">
                              {message.itinerary.error}
                            </div>
                          ) : message.itinerary ? (
                            message.itinerary.map((day, index) => (
                              <div
                                key={index}
                                className="border-l-2 border-[var(--gold-accent)] pl-4"
                              >
                                <h4 className="font-bold text-[var(--gold-accent)] mb-2">
                                  {day.day}
                                </h4>
                                <div className="mb-2">
                                  <p className="text-xs opacity-80 mb-1">
                                    Places to visit:
                                  </p>
                                  <ul className="text-xs space-y-1">
                                    {day.places.map((place, placeIndex) => (
                                      <li
                                        key={placeIndex}
                                        className="flex items-center gap-1"
                                      >
                                        <span className="w-1 h-1 bg-[var(--gold-accent)] rounded-full"></span>
                                        {place}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ))
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-xs text-[var(--text-secondary)] ${
                      message.sender === "user" ? "pr-1" : "pl-1"
                    }`}
                  >
                    {message.time}
                  </span>
                </div>

                {message.sender === "user" && (
                  <div className="w-9 h-9 rounded-full bg-[var(--gold-accent)] flex items-center justify-center shrink-0 text-white font-bold">
                    S
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--nile-indigo)] flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-[var(--gold-accent)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 11c-1.333 0-4-1.667-4-5s1.667-4 4-4 4 1.667 4 4-2.667 5-4 5zm0 0c-2.333 0-7 1.167-7 3.5V18h14v-3.5c0-2.333-4.667-3.5-7-3.5z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div className="flex items-center space-x-1.5 bg-[var(--nile-indigo)]/20 rounded-full p-2.5">
                  <div className="w-2 h-2 bg-[var(--nile-indigo)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-[var(--nile-indigo)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-[var(--nile-indigo)] rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>
        </main>
        <footer className="fixed bottom-0 left-0 right-0 z-10 bg-[var(--papyrus-cream)]/80 backdrop-blur-sm border-t border-t-[var(--border-color)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <button className="flex items-center justify-center rounded-full h-10 w-10 text-[var(--nile-indigo)] hover:bg-[var(--nile-indigo)]/10 shrink-0">
                <svg
                  fill="currentColor"
                  height="22"
                  viewBox="0 0 256 256"
                  width="22"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                </svg>
              </button>
              <div className="relative flex-1">
                <input
                  className="form-input w-full resize-none overflow-hidden rounded-full text-[var(--nile-indigo)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-accent)] border-2 border-[var(--border-color)] bg-white/70 h-12 placeholder:text-[var(--text-secondary)] px-5 pr-12 text-sm"
                  placeholder="Message Terhal..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center rounded-full h-9 w-9 bg-[var(--nile-indigo)] text-[var(--gold-accent)] hover:bg-opacity-90"
                  onClick={handleSendMessage}
                >
                  <svg
                    fill="currentColor"
                    height="20"
                    viewBox="0 0 256 256"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M232,128a8,8,0,0,1-8.53,7.94l-56,8A8,8,0,0,1,160,128h0a8,8,0,0,1,7.47-8l56-8A8,8,0,0,1,232,128ZM34.22,46.22l160,80a8,8,0,0,1,0,15.56l-160,80A8,8,0,0,1,24,216V40A8,8,0,0,1,34.22,46.22ZM40,200.65,183.14,136H88a8,8,0,0,1,0-16h95.14L40,55.35Z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
