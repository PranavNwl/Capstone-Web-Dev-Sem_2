import { useNavigate } from "react-router-dom";
import { useMindMap } from "../context/MindMapContext";

function Saved() {
  const { maps, deleteMap } = useMindMap();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "#6c63ff", marginBottom: "10px" }}>📂 Saved Maps</h1>
      <p style={{ color: "#aaa", marginBottom: "30px" }}>
        You have {maps.length} saved map{maps.length !== 1 ? "s" : ""}.
      </p>

      {/* If no maps */}
      {maps.length === 0 && (
        <div style={{
          backgroundColor: "#16213e",
          padding: "40px",
          borderRadius: "12px",
          textAlign: "center",
          color: "#aaa"
        }}>
          <p style={{ fontSize: "18px" }}>No maps yet!</p>
          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              backgroundColor: "#6c63ff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px"
            }}
          >
            Create your first map
          </button>
        </div>
      )}

      {/* Map cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {maps.map((map) => (
          <div key={map.id} style={{
            backgroundColor: "#16213e",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #333",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <h3 style={{ color: "white", marginBottom: "5px" }}>{map.title}</h3>
              <p style={{ color: "#aaa", fontSize: "13px" }}>
                {map.nodes.length} nodes · {map.connections.length} connections
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => navigate("/editor/" + map.id)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6c63ff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px"
                }}
              >
                Open ✏️
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this map?")) deleteMap(map.id);
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px"
                }}
              >
                Delete 🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Saved;
