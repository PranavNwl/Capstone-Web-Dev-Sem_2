import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1 style={{ fontSize: "80px", color: "#6c63ff" }}>404</h1>
      <h2 style={{ color: "white", marginBottom: "10px" }}>Page Not Found</h2>
      <p style={{ color: "#aaa", marginBottom: "20px" }}>This page doesn't exist.</p>
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 24px",
          backgroundColor: "#6c63ff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "15px"
        }}
      >
        Go Home
      </button>
    </div>
  );
}

export default NotFound;
