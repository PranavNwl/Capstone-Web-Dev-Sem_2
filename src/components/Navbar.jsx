import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      backgroundColor: "#16213e",
      padding: "15px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "2px solid #6c63ff"
    }}>
      {/* Logo */}
      <Link to="/" style={{ color: "#6c63ff", fontSize: "22px", fontWeight: "bold", textDecoration: "none" }}>
        🧠 MindMap
      </Link>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "15px" }}>
          Home
        </Link>
        <Link to="/saved" style={{ color: "white", textDecoration: "none", fontSize: "15px" }}>
          Saved Maps
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
