import React from 'react';
import './Pagination.css';

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  maxVisiblePages = 5,
  className = '',
  showTotal = true,
  showPageNumbers = true,
  showNavigation = true
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Si no hay páginas, no mostrar la paginación
  if (totalPages <= 1) return null;

  // Calcular páginas visibles
  const getVisiblePages = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`pagination ${className}`}>
      {showTotal && (
        <div className="pagination-info">
          Mostrando {startItem} - {endItem} de {totalItems} elementos
        </div>
      )}
      
      {showNavigation && (
        <nav className="pagination-nav" aria-label="Pagination">
          <button
            className="pagination-btn pagination-prev"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            ‹
          </button>

          {showPageNumbers && (
            <>
              {/* Primera página */}
              {visiblePages[0] > 1 && (
                <>
                  <button
                    className={`pagination-btn ${1 === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </button>
                  {visiblePages[0] > 2 && <span className="pagination-ellipsis">...</span>}
                </>
              )}

              {/* Páginas visibles */}
              {visiblePages.map(page => (
                <button
                  key={page}
                  className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              {/* Última página */}
              {visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                  {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                    <span className="pagination-ellipsis">...</span>
                  )}
                  <button
                    className={`pagination-btn ${totalPages === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </>
          )}

          <button
            className="pagination-btn pagination-next"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Página siguiente"
          >
            ›
          </button>
        </nav>
      )}
    </div>
  );
};

export default Pagination;