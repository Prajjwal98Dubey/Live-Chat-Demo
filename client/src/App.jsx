import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [wsObj, setWsObj] = useState(null);
  const scrollRef = useRef(null);
  const handleConnectRoom = async () => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ userName: user }));
      setWsObj(ws);
    });
    setIsConnected(true);
  };
  useEffect(() => {
    if (wsObj) {
      wsObj.addEventListener("message", (payload) => {
        const { data, user } = JSON.parse(payload.data);
        setMessages([...messages, { data, user }]);
      });
    } else {
      console.log("expecting here.");
    }
  });
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  const handleSendMessage = () => {
    wsObj.send(JSON.stringify({ data: inputText, user: user }));
    setMessages([...messages, { data: inputText, user }]);
    setInputText("");
  };
  return (
    <>
      <div>
        {isVisible && (
          <div className="container">
            <input
              type="text"
              placeholder="enter username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <button onClick={() => setIsVisible(false)}>send</button>
          </div>
        )}
        {!isVisible && (
          <>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "30px",
                    textAlign: "center",
                  }}
                >
                  {user}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {!isConnected ? (
                    <button onClick={handleConnectRoom}>connect</button>
                  ) : (
                    <button
                      style={{ backgroundColor: "gray", cursor: "not-allowed" }}
                    >
                      connected
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="room_container" ref={scrollRef}>
                <div>
                  {messages.map((message, index) => (
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "normal",
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "5px",
                      }}
                      key={index}
                    >
                      <div
                        style={{
                          color: "gray",
                          fontWeight: "lighter",
                          fontSize: "14px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "2px",
                          margin: "3px",
                        }}
                      >
                        {message.user}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "2px",
                          margin: "3px",
                        }}
                      >
                        {message.data}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div>
                <input
                  type="text"
                  className="room_inp"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
              <div>
                <button onClick={handleSendMessage} className="send">
                  send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
