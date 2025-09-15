import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBook, 
  FaFirstAid, 
  FaFlag, 
  FaTrash,
  FaUser,
  FaSignOutAlt,
  FaTimes
} from 'react-icons/fa';
import './sidebar.css';

const Sidebar = ({ isOpen, isMobile, onClose }) => {
  const location = useLocation();
  
  const mainMenuItems = [
    { path: '/joven/', icon: <FaHome />, label: 'Inicio' },
    { path: '/joven/Diario', icon: <FaBook />, label: 'Diario' },
    { path: '/joven/KitEmergencia', icon: <FaFirstAid />, label: 'Kit de emergencia' },
    { path: '/joven/Promesa', icon: <FaFlag />, label: 'Promesas' },
  ];

  const trashItem = { 
    path: '/joven/papelera', 
    icon: <FaTrash />, 
    label: 'Papelera' 
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''}`}>
        {isMobile && (
          <button className="sidebar-close" onClick={onClose}>
            <FaTimes />
          </button>
        )}
        <nav className="sidebar-nav">
          <ul>
            {mainMenuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => isMobile && onClose()}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {isOpen && <span className="nav-label">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="sidebar-bottom">
            <div className="menu-divider"></div>
            <ul>
              <li>
                <Link 
                  to={trashItem.path} 
                  className={`nav-item ${location.pathname === trashItem.path ? 'active' : ''}`}
                  onClick={() => isMobile && onClose()}
                >
                  <span className="nav-icon">{trashItem.icon}</span>
                  {isOpen && <span className="nav-label">{trashItem.label}</span>}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;