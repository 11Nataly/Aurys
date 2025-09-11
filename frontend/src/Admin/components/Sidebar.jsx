import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBook, 
  FaFirstAid, 
  FaFlag, 
  FaTrash,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';
import '../styles/sidebar.css';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: <FaHome />, label: 'Inicio' },
    { path: '/diario', icon: <FaBook />, label: 'Diario' },
    { path: '/kit', icon: <FaFirstAid />, label: 'Kit de emergencia' },
    { path: '/promesas', icon: <FaFlag />, label: 'Promesas' },
    { path: '/papelera', icon: <FaTrash />, label: 'Papelera' },
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