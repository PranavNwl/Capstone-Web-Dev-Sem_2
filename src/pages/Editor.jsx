import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMindMap } from "../context/MindMapContext";

function Editor() {
  const { mapId } = useParams();
  const navigate = useNavigate();
  const { getMap, addNode, moveNode, editNode, deleteNode, addConnection } = useMindMap();

  const map = getMap(mapId);

  // State
  const [newNodeText, setNewNodeText] = useState("");
  const [connectMode, setConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState(null);
  const [editingNode, setEditingNode] = useState(null); // { id, text }
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // Dragging state (using ref so it doesn't cause re-renders)
  const dragging = useRef(null); // { nodeId, startMouseX, startMouseY, startNodeX, startNodeY }

  if (!map) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Map not found!</h2>
        <button onClick={() => navigate("/")} style={{ marginTop: "15px", padding: "10px 20px", backgroundColor: "#6c63ff", color: "white", border: "none", borderRadius: "8px" }}>
          Go Home
        </button>
      </div>
    );
  }

  // ---- Drag logic ----
  function handleNodeMouseDown(e, nodeId) {
    e.preventDefault();
    e.stopPropagation();
    const node = map.nodes.find(n => n.id === nodeId);

    // If connect mode: pick node to connect to/from
    if (connectMode) {
      if (connectFrom === null) {
        setConnectFrom(nodeId);
      } else if (connectFrom !== nodeId) {
        addConnection(map.id, connectFrom, nodeId);
        setConnectFrom(null);
        setConnectMode(false);
      }
      return;
    }

    setSelectedNode(nodeId);
    dragging.current = {
      nodeId,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startNodeX: node.x,
      startNodeY: node.y
    };
  }

  function handleMouseMove(e) {
    if (!dragging.current) return;
    const dx = e.clientX - dragging.current.startMouseX;
    const dy = e.clientY - dragging.current.startMouseY;
    moveNode(map.id, dragging.current.nodeId, dragging.current.startNodeX + dx, dragging.current.startNodeY + dy);
  }

  function handleMouseUp() {
    dragging.current = null;
  }

  // ---- Add node ----
  function handleAddNode() {
    if (newNodeText.trim() === "") {
      alert("Enter some text for the node!");
      return;
    }
    addNode(map.id, newNodeText);
    setNewNodeText("");
  }

  // ---- Edit node (double click) ----
  function handleDoubleClick(e, node) {
    e.stopPropagation();
    setEditingNode({ id: node.id, text: node.text });
  }

  function saveEdit() {
    if (editingNode) {
      editNode(map.id, editingNode.id, editingNode.text);
      setEditingNode(null);
    }
  }

  // ---- AI Suggestions (Anthropic API) ----
  async function fetchAISuggestions() {
    const node = map.nodes.find(n => n.id === selectedNode);
    if (!node) {
      alert("Click a node first, then press AI Suggest!");
      return;
    }
    setAiLoading(true);
    setAiSuggestions([]);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a brainstorming assistant. Respond ONLY with a JSON array of 5 short strings (2-4 words each). No explanation, no markdown.",
          messages: [{ role: "user", content: `Give 5 subtopic ideas for: "${node.text}"` }]
        })
      });
      const data = await response.json();
      const text = data.content[0].text;
      const ideas = JSON.parse(text.replace(/```json|```/g, "").trim());
      setAiSuggestions(ideas);
    } catch (err) {
      alert("AI request failed. Check your connection.");
    }
    setAiLoading(false);
  }

  function addSuggestionAsNode(text) {
    addNode(map.id, text);
    if (selectedNode) {
      // slight delay to get the new node id
      setTimeout(() => {
        const updated = getMap(mapId);
        const newest = updated.nodes[updated.nodes.length - 1];
        if (newest) addConnection(map.id, selectedNode, newest.id);
      }, 50);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* Top bar */}
      <div style={{
        backgroundColor: "#16213e",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        borderBottom: "1px solid #333",
        flexWrap: "wrap"
      }}>
        <button onClick={() => navigate("/saved")} style={{ padding: "7px 14px", backgroundColor: "#333", color: "white", border: "none", borderRadius: "8px" }}>
          ← Back
        </button>

        <span style={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>
          🗺️ {map.title}
        </span>

        {/* Add node input */}
        <input
          type="text"
          placeholder="New node text..."
          value={newNodeText}
          onChange={(e) => setNewNodeText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddNode()}
          style={{
            padding: "7px 12px",
            borderRadius: "8px",
            border: "1px solid #6c63ff",
            backgroundColor: "#1a1a2e",
            color: "white",
            fontSize: "14px",
            width: "180px"
          }}
        />
        <button onClick={handleAddNode} style={{ padding: "7px 14px", backgroundColor: "#6c63ff", color: "white", border: "none", borderRadius: "8px" }}>
          ➕ Add Node
        </button>

        {/* Connect mode button */}
        <button
          onClick={() => { setConnectMode(!connectMode); setConnectFrom(null); }}
          style={{
            padding: "7px 14px",
            backgroundColor: connectMode ? "#e74c3c" : "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "8px"
          }}
        >
          {connectMode ? `🔗 Connecting from: ${connectFrom ? "click target" : "click source"}` : "🔗 Connect Nodes"}
        </button>

        {/* AI button */}
        <button
          onClick={fetchAISuggestions}
          disabled={aiLoading}
          style={{ padding: "7px 14px", backgroundColor: "#f39c12", color: "white", border: "none", borderRadius: "8px" }}
        >
          {aiLoading ? "⏳ Loading..." : "🤖 AI Suggest"}
        </button>

        <span style={{ color: "#aaa", fontSize: "13px" }}>
          {map.nodes.length} nodes | Double-click to edit | Drag to move
        </span>
      </div>

      {/* Main area: Canvas + AI panel */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Canvas */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#0f0f1a",
            cursor: connectMode ? "crosshair" : "default"
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={() => { if (!connectMode) setSelectedNode(null); }}
        >
          {/* SVG for connections */}
          <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            {map.connections.map((conn) => {
              const fromNode = map.nodes.find(n => n.id === conn.from);
              const toNode = map.nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;
              return (
                <line
                  key={conn.id}
                  x1={fromNode.x + 70}
                  y1={fromNode.y + 25}
                  x2={toNode.x + 70}
                  y2={toNode.y + 25}
                  stroke="#6c63ff"
                  strokeWidth="2"
                  strokeOpacity="0.6"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {map.nodes.map((node) => (
            <div
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              onDoubleClick={(e) => handleDoubleClick(e, node)}
              style={{
                position: "absolute",
                left: node.x,
                top: node.y,
                backgroundColor: node.color,
                borderRadius: "10px",
                padding: "10px 18px",
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: connectMode ? "pointer" : "grab",
                userSelect: "none",
                minWidth: "140px",
                textAlign: "center",
                border: selectedNode === node.id ? "3px solid white" : "3px solid transparent",
                boxShadow: selectedNode === node.id ? "0 0 15px rgba(255,255,255,0.4)" : "0 4px 12px rgba(0,0,0,0.3)"
              }}
            >
              {/* Inline edit */}
              {editingNode && editingNode.id === node.id ? (
                <input
                  autoFocus
                  value={editingNode.text}
                  onChange={(e) => setEditingNode({ ...editingNode, text: e.target.value })}
                  onBlur={saveEdit}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: "2px solid white",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                    width: "100%",
                    textAlign: "center",
                    outline: "none"
                  }}
                />
              ) : (
                node.text
              )}

              {/* Delete button on selected node */}
              {selectedNode === node.id && !editingNode && !node.isRoot && (
                <button
                  onMouseDown={(e) => { e.stopPropagation(); deleteNode(map.id, node.id); setSelectedNode(null); }}
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {/* Helper text when empty */}
          {map.nodes.length === 1 && (
            <div style={{
              position: "absolute",
              bottom: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#555",
              fontSize: "14px",
              textAlign: "center",
              pointerEvents: "none"
            }}>
              Add nodes using the toolbar above ↑<br />
              Click a node to select it · Double-click to edit
            </div>
          )}
        </div>

        {/* AI Suggestions Panel */}
        {aiSuggestions.length > 0 && (
          <div style={{
            width: "220px",
            backgroundColor: "#16213e",
            borderLeft: "1px solid #6c63ff",
            padding: "20px",
            overflowY: "auto"
          }}>
            <h3 style={{ color: "#f39c12", marginBottom: "15px", fontSize: "15px" }}>
              🤖 AI Ideas
            </h3>
            <p style={{ color: "#aaa", fontSize: "12px", marginBottom: "15px" }}>
              Click to add to canvas
            </p>
            {aiSuggestions.map((idea, i) => (
              <button
                key={i}
                onClick={() => addSuggestionAsNode(idea)}
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "8px",
                  padding: "10px",
                  backgroundColor: "#1a1a2e",
                  color: "white",
                  border: "1px solid #6c63ff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  textAlign: "left",
                  cursor: "pointer"
                }}
              >
                ➕ {idea}
              </button>
            ))}
            <button
              onClick={() => setAiSuggestions([])}
              style={{ marginTop: "10px", width: "100%", padding: "8px", backgroundColor: "#333", color: "#aaa", border: "none", borderRadius: "8px", fontSize: "13px" }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Editor;
