import Home from "./pages/Home";

export default function JovenLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar: le pasamos toggle para abrir/cerrar en móvil */}
      <header className="w-full">
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />
      </header>

      <div className="flex flex-1">
        {/* Sidebar: en móvil será overlay basado en sidebarOpen */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main area */}
        <main
          className="flex-1 p-4 md:p-6 overflow-auto"
          // cuando el sidebar overlay está abierto en móvil, podría evitar interacción con main
          aria-hidden={sidebarOpen ? "true" : "false"}
        >
          <Routes>
            <Route index element={<Home />} /> {/* equivale a /paciente */}
            <Route path="Home" element={<Home />} />
            <Route path="*" element={<Navigate to="Home" replace />} />
            
          </Routes>
        </main>
      </div>
    </div>
  );
}