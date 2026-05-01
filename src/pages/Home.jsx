import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMindMap } from "../context/MindMapContext";

function Home() {
  const [title, setTitle] = useState("");
  const { createMap } = useMindMap();
  const navigate = useNavigate();

  function handleCreate() {
    if (title.trim() === "") {
      alert("Please enter a title for your map!");
      return;
    }
    const newId = createMap(title);
    navigate("/editor/" + newId);
  }

  return (
    <div style={{
      minHeight: "90vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>

      {/* Heading */}
      <h1 style={{ fontSize: "42px", color: "#6c63ff", marginBottom: "10px" }}>
        🧠 Mind Map Tool
      </h1>
      <p style={{ fontSize: "18px", color: "#aaa", marginBottom: "40px", textAlign: "center" }}>
        Organize your ideas visually. Create nodes, connect them, and brainstorm freely.
      </p>

      {/* Create Map Box */}
      <div style={{
        backgroundColor: "#16213e",
        padding: "40px",
        borderRadius: "12px",
        border: "1px solid #6c63ff",
        width: "100%",
        maxWidth: "450px",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: "20px", color: "white" }}>Create New Map</h2>

        <input
          type="text"
          placeholder="Enter map title (e.g. My Project)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #6c63ff",
            backgroundColor: "#1a1a2e",
            color: "white",
            fontSize: "15px",
            marginBottom: "15px"
          }}
        />

        <button
          onClick={handleCreate}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#6c63ff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          ➕ Create Map
        </button>
      </div>

      {/* Features */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginTop: "50px",
        flexWrap: "wrap",
        justifyContent: "center"
      }}>
        {[
          { icon: "🖱️", text: "Drag nodes around" },
          { icon: "✏️", text: "Double-click to edit" },
          { icon: "🔗", text: "Connect nodes" },
          { icon: "🤖", text: "AI idea suggestions" },
          { icon: "💾", text: "Auto saved" },
        ].map((f) => (
          <div key={f.text} style={{
            backgroundColor: "#16213e",
            padding: "16px 20px",
            borderRadius: "10px",
            border: "1px solid #333",
            textAlign: "center",
            fontSize: "14px",
            color: "#ccc",
            minWidth: "130px"
          }}>
            <div style={{ fontSize: "26px", marginBottom: "8px" }}>{f.icon}</div>
            {f.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
