import React, { useState } from "react";

export default function AssistantFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={toggleChat}
          className={`group relative w-16 h-16 bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-800 hover:from-blue-700 hover:via-indigo-800 hover:to-blue-900 text-white rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300/50 ${
            isOpen ? 'rotate-45' : 'rotate-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {isOpen ? (
            <svg
              className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 text-yellow-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
          )}
          
          {/* Notification Badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            !
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-5 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Chat with Terhal AI
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-96 h-[480px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-800 p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">Terhal AI</h3>
              <p className="text-yellow-300 text-sm">Your Travel Assistant</p>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-yellow-300 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50 to-indigo-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                {message.sender === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}

                <div
                  className={`flex flex-col gap-1 max-w-xs ${
                    message.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`${
                      message.sender === "assistant"
                        ? "bg-white text-gray-800 rounded-xl rounded-tl-none shadow-md"
                        : "bg-blue-600 text-white rounded-xl rounded-tr-none"
                    } px-3 py-2`}
                  >
                    {message.type === "text" ? (
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    ) : (
                      <div className="text-sm leading-relaxed">
                        <p className="mb-3 font-semibold">Here's your personalized itinerary:</p>
                        <div className="space-y-3">
                          {message.itinerary?.error ? (
                            <div className="text-sm text-red-500">
                              {message.itinerary.error}
                            </div>
                          ) : message.itinerary ? (
                            message.itinerary.map((day, index) => (
                              <div
                                key={index}
                                className="border-l-3 border-blue-400 pl-3"
                              >
                                <h4 className="font-bold text-blue-600 mb-1 text-sm">
                                  {day.day}
                                </h4>
                                <div className="mb-2">
                                  <p className="text-xs text-gray-600 mb-1">
                                    Places to visit:
                                  </p>
                                  <ul className="text-xs space-y-1">
                                    {day.places?.map((place, placeIndex) => (
                                      <li
                                        key={placeIndex}
                                        className="flex items-center gap-1"
                                      >
                                        <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
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
                  <span className="text-xs text-gray-500 px-1">
                    {message.time}
                  </span>
                </div>

                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-white font-bold text-sm">
                    U
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-yellow-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="flex items-center space-x-1 bg-white rounded-full p-2 shadow-md">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  className="w-full resize-none overflow-hidden rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300 bg-gray-50 h-10 placeholder:text-gray-500 px-4 pr-12 text-sm"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center justify-center rounded-full h-8 w-8 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                  onClick={handleSendMessage}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}