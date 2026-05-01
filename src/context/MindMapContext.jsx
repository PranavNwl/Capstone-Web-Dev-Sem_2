import { createContext, useContext, useState, useEffect } from "react";

// Step 1: Create the context
const MindMapContext = createContext();

// Step 2: Create the Provider component
export function MindMapProvider({ children }) {

  // Load saved maps from localStorage (or start with empty array)
  const [maps, setMaps] = useState(() => {
    const saved = localStorage.getItem("mindmaps");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever maps change
  useEffect(() => {
    localStorage.setItem("mindmaps", JSON.stringify(maps));
  }, [maps]);

  // Create a new map
  function createMap(title) {
    const newMap = {
      id: Date.now(),
      title: title,
      nodes: [
        { id: 1, text: title, x: 350, y: 250, color: "#6c63ff" }
      ],
      connections: []
    };
    setMaps([...maps, newMap]);
    return newMap.id;
  }

  // Delete a map
  function deleteMap(id) {
    setMaps(maps.filter(m => m.id !== id));
  }

  // Get one map by id
  function getMap(id) {
    return maps.find(m => m.id === Number(id));
  }

  // Add a node to a map
  function addNode(mapId, text) {
    const colors = ["#6c63ff", "#ff6584", "#43e97b", "#f7971e", "#4facfe"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newNode = {
      id: Date.now(),
      text: text,
      x: 100 + Math.random() * 500,
      y: 100 + Math.random() * 300,
      color: randomColor
    };
    setMaps(maps.map(m => {
      if (m.id !== mapId) return m;
      return { ...m, nodes: [...m.nodes, newNode] };
    }));
    return newNode.id;
  }

  // Move a node (update its x, y position)
  function moveNode(mapId, nodeId, x, y) {
    setMaps(maps.map(m => {
      if (m.id !== mapId) return m;
      return {
        ...m,
        nodes: m.nodes.map(n => n.id === nodeId ? { ...n, x, y } : n)
      };
    }));
  }

  // Edit node text
  function editNode(mapId, nodeId, newText) {
    setMaps(maps.map(m => {
      if (m.id !== mapId) return m;
      return {
        ...m,
        nodes: m.nodes.map(n => n.id === nodeId ? { ...n, text: newText } : n)
      };
    }));
  }

  // Delete a node
  function deleteNode(mapId, nodeId) {
    setMaps(maps.map(m => {
      if (m.id !== mapId) return m;
      return {
        ...m,
        nodes: m.nodes.filter(n => n.id !== nodeId),
        connections: m.connections.filter(c => c.from !== nodeId && c.to !== nodeId)
      };
    }));
  }

  // Add a connection between two nodes
  function addConnection(mapId, fromId, toId) {
    const newConn = { id: Date.now(), from: fromId, to: toId };
    setMaps(maps.map(m => {
      if (m.id !== mapId) return m;
      return { ...m, connections: [...m.connections, newConn] };
    }));
  }

  return (
    <MindMapContext.Provider value={{
      maps,
      createMap,
      deleteMap,
      getMap,
      addNode,
      moveNode,
      editNode,
      deleteNode,
      addConnection
    }}>
      {children}
    </MindMapContext.Provider>
  );
}

// Step 3: Custom hook to use context easily
export function useMindMap() {
  return useContext(MindMapContext);
}
