// src/Joven/components/Breadcrumb/Breadcrumb.jsx
import { useLocation, Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import './breadcrumb.css';

const Breadcrumb = () => {
  const location = useLocation();

  const getBreadcrumbItems = () => {
    const breadcrumbItems = [];

    // Siempre empezamos con Home
    breadcrumbItems.push({ 
      name: 'Home', 
      path: '/joven/home', 
      isActive: false
    });

    // Determinar la estructura del breadcrumb basado en la ruta actual
    if (location.pathname === '/joven/diario') {
      breadcrumbItems.push({ 
        name: 'Diario', 
        path: '/joven/diario', 
        isActive: true 
      });
    }
    else if (location.pathname === '/joven/kit-emergencia') {
      breadcrumbItems.push({ 
        name: 'Kit de emergencia', 
        path: '/joven/kit-emergencia', 
        isActive: true 
      });
    }
    else if (location.pathname.includes('/joven/kit-emergencia/afrontamiento') || 
             location.pathname === '/joven/afrontamiento') {
      // SIEMPRE mostrar Kit de emergencia antes de Afrontamiento
      breadcrumbItems.push({ 
        name: 'Kit de emergencia', 
        path: '/joven/kit-emergencia', 
        isActive: false 
      });
      breadcrumbItems.push({ 
        name: 'Afrontamiento', 
        path: location.pathname.includes('/joven/kit-emergencia/afrontamiento') 
              ? '/joven/kit-emergencia/afrontamiento' 
              : '/joven/afrontamiento', 
        isActive: true 
      });
    }
    else if (location.pathname === '/joven/promesas') {
      breadcrumbItems.push({ 
        name: 'Promesas', 
        path: '/joven/promesas', 
        isActive: true 
      });
    }

    return breadcrumbItems;
  };

  const breadcrumbItems = getBreadcrumbItems();
  
  // No mostrar breadcrumb si está en Home o solo tiene Home
  const showBreadcrumb = breadcrumbItems.length > 1 && location.pathname !== '/joven/home';

  if (!showBreadcrumb) return null;

  return (
    <nav className="breadcrumb-container" aria-label="Migas de pan">
      {breadcrumbItems.map((item, index) => (
        <span key={index} className="breadcrumb-item-container">
          {index > 0 && (
            <span className="breadcrumb-separator">
              <FaChevronRight />
            </span>
          )}
          {item.isActive ? (
            <span className="breadcrumb-item active">{item.name}</span>
          ) : (
            <Link to={item.path} className="breadcrumb-item">
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;