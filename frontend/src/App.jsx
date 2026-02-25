import { useState } from "react";
import axios from "axios";
import "./style.css";

const API = "http://localhost:3001";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    await axios.post(`${API}/api/upload`, formData);
    alert("Document uploaded successfully");
  };

  const send = async () => {
    if (!message.trim()) return;

    setChat([...chat, { role: "user", text: message }]);
    setLoading(true);

    const res = await axios.post(`${API}/api/chat`, { message });

    setChat((prev) => [
      ...prev,
      { role: "assistant", text: res.data.reply },
    ]);

    setMessage("");
    setLoading(false);
  };

  return (
    <div className="app">
      <div className="card">
        <h2>🤖 AI Support Assistant</h2>

        <div className="upload">
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={upload}>Upload</button>
        </div>

        <div className="chat-box">
          {chat.map((c, i) => (
            <div key={i} className={`message ${c.role}`}>
              {c.text}
            </div>
          ))}
          {loading && <div className="message assistant">Typing...</div>}
        </div>

        <div className="input-area">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something..."
          />
          <button onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;