// src/Joven/components/Sidebar/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBook, 
  FaFirstAid, 
  FaFlag
} from 'react-icons/fa';
import './sidebar.css';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/joven/home', icon: <FaHome />, label: 'Inicio' },
    { path: '/joven/diario', icon: <FaBook />, label: 'Diario' },
    { path: '/joven/kit-emergencia', icon: <FaFirstAid />, label: 'Kit de emergencia' },
    { path: '/joven/promesas', icon: <FaFlag />, label: 'Promesas' }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {isOpen && <span className="nav-label">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;