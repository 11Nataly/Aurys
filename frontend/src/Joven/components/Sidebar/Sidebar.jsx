import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaBook, 
  FaFirstAid, 
  FaFlag,
  FaTrash // Agregar el icono de papelera
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

  // Variantes de Framer Motion para animar la lista de ítems
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-nav">
        <motion.ul
          variants={listVariants}
          initial="hidden"
          animate={isOpen ? "visible" : "hidden"}
        >
          {menuItems.map((item) => (
            <motion.li key={item.path} variants={itemVariants}>
              <Link 
                to={item.path} 
                className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {isOpen && <span className="nav-label">{item.label}</span>}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </nav>
      
      {/* Sección inferior con el icono de papelera */}
      <div className="sidebar-bottom">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isOpen ? "visible" : "hidden"}
        >
          <Link 
            to="/joven/papelera" 
            className={`nav-item ${location.pathname === '/joven/papelera' ? 'active' : ''}`}
          >
            <span className="nav-icon">
              <FaTrash />
            </span>
            {isOpen && <span className="nav-label">Papelera</span>}
          </Link>
        </motion.div>
      </div>
    </aside>
  );
};

export default Sidebar;