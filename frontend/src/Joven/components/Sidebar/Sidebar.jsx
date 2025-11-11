import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, 
  FaBook, 
  FaFirstAid, 
  FaFlag,
  FaTrash
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

  // Variantes para animación de labels
  const labelVariants = {
    hidden: { opacity: 0, width: 0 },
    visible: { 
      opacity: 1, 
      width: "auto",
      transition: { duration: 0.3 }
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-nav">
        {/* Quitamos los puntos de la lista con list-style: none */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.path} style={{ margin: '0.5rem 0' }}>
              <Link 
                to={item.path} 
                className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <AnimatePresence>
                  {isOpen && (
                    <motion.span 
                      className="nav-label"
                      variants={labelVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Sección inferior */}
      <div className="sidebar-bottom">
        <Link 
          to="/joven/papelera" 
          className={`nav-item ${location.pathname === '/joven/papelera' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <FaTrash />
          </span>
          <AnimatePresence>
            {isOpen && (
              <motion.span 
                className="nav-label"
                variants={labelVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                Papelera
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;