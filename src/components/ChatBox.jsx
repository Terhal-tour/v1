import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  const currentUser = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("jwt");
  const currentUserId = currentUser ? currentUser.id : null;
  const { toUserId } = useParams();

  useEffect(() => {
  if (!token || !currentUserId) return;

  const socket = io("http://localhost:3000", {
//   const socket = io("https://backend-mu-ten-26.vercel.app", {
    auth: { token }
  });

  socketRef.current = socket;

  socket.on("connect", () => {
    socket.emit("register", currentUserId);
    console.log("✅ Registered after socket connect:", currentUserId);
  });

  socket.on("receive_message", (data) => {
    setChat(prev => [...prev, data]);
  });

  return () => {
    socket.disconnect();
  };
}, [token, currentUserId]);

  useEffect(() => {
    if (!socketRef.current || !currentUserId) return;
    const socket = socketRef.current;

    socket.emit("register", currentUserId);
    console.log("Registered user:", currentUserId);

    const handleReceiveMessage = (data) => {
      setChat(prev => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [currentUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUserId || !toUserId) return;

      try {
        const res = await fetch(`https://backend-mu-ten-26.vercel.app/messages/${currentUserId}/${toUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setChat(data.sort((a, b) => new Date(a.time) - new Date(b.time)));
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    fetchMessages();
  }, [currentUserId, toUserId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      fromUserId: currentUserId,
      toUserId,
      message,
      time: new Date().toISOString()
    };

    socketRef.current?.emit("send_message", msgData);
    setChat(prev => [...prev, msgData]);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.avatar}>
            {toUserId?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 style={styles.headerTitle}>Chat with {toUserId}</h2>
            <div style={styles.onlineStatus}>
              <div style={styles.onlineDot}></div>
              Online
            </div>
          </div>
        </div>
      </div>
      
      <div style={styles.chatBox}>
        {chat.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💬</div>
            <p style={styles.emptyText}>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          chat.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageWrapper,
                justifyContent: msg.fromUserId === currentUserId ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  ...styles.message,
                  backgroundColor: msg.fromUserId === currentUserId ? '#007bff' : '#ffffff',
                  color: msg.fromUserId === currentUserId ? '#ffffff' : '#333333',
                  borderBottomRightRadius: msg.fromUserId === currentUserId ? '4px' : '18px',
                  borderBottomLeftRadius: msg.fromUserId === currentUserId ? '18px' : '4px'
                }}
              >
                <span style={styles.messageText}>{msg.message}</span>
                <div style={{
                  ...styles.timestamp,
                  color: msg.fromUserId === currentUserId ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'
                }}>
                  {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
      
      <div style={styles.inputBox}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.input}
        />
        <button 
          onClick={sendMessage} 
          style={{
            ...styles.button,
            opacity: message.trim() ? 1 : 0.5,
            cursor: message.trim() ? 'pointer' : 'not-allowed'
          }}
          disabled={!message.trim()}
        >
          <span style={styles.buttonIcon}>➤</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    border: '1px solid rgba(0, 0, 0, 0.05)'
  },
  header: {
    backgroundColor: '#007bff',
    background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
    padding: '20px 24px',
    color: 'white'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white'
  },
  headerTitle: {
    margin: '0 0 4px 0',
    fontSize: '20px',
    fontWeight: '600',
    color: 'white'
  },
  onlineStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  onlineDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#28a745',
    boxShadow: '0 0 0 0 rgba(40, 167, 69, 1)',
    animation: 'pulse 2s infinite'
  },
  chatBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '480px',
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    backgroundImage: `
      radial-gradient(circle at 1px 1px, rgba(0,123,255,0.03) 1px, transparent 0)
    `,
    backgroundSize: '20px 20px'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#6c757d'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5
  },
  emptyText: {
    fontSize: '16px',
    margin: 0,
    textAlign: 'center'
  },
  messageWrapper: {
    display: 'flex',
    marginBottom: '12px'
  },
  message: {
    maxWidth: '75%',
    padding: '12px 16px 8px 16px',
    borderRadius: '18px',
    position: 'relative',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    wordWrap: 'break-word'
  },
  messageText: {
    display: 'block',
    lineHeight: '1.4',
    fontSize: '15px'
  },
  timestamp: {
    fontSize: '11px',
    marginTop: '6px',
    display: 'block',
    textAlign: 'right'
  },
  inputBox: {
    display: 'flex',
    gap: '12px',
    padding: '20px 24px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)'
  },
  input: {
    flex: 1,
    padding: '14px 16px',
    border: '2px solid #e9ecef',
    borderRadius: '24px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#f8f9fa'
  },
  button: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)'
  },
  buttonIcon: {
    fontSize: '18px',
    transform: 'translateX(1px)'
  }
};

export default ChatBox;