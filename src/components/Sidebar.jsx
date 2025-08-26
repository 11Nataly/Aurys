import { FaHome, FaBook, FaHeartbeat, FaFlag, FaTrash } from "react-icons/fa";
import "../styles/sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">Aurys</div>
      <nav>
        <ul>
          <li><FaHome /><span>Home</span></li>
          <li><FaBook /><span>Diario</span></li>
          <li><FaHeartbeat /><span>Afrontamiento</span></li>
          <li><FaFlag /><span>Emergencia</span></li>
          <li><FaTrash /><span>Problemas</span></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;