import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/Team";
import Contacts from "./scenes/contacts";
import Form from "./scenes/form";
import Liquidacion from "./scenes/liquidacion";
import Anticipos from "./scenes/anticipos/index";
import AprobacionAnticipos from "./scenes/anticipos/aprobarAnticipos";
import AprobacionAnticiposDIFA from "./scenes/anticipos/aprobarAnticiposDIFA";
import Consultas from './pages/Consultas';
import Login from './login/Login';
import { ColorModelContext, useMode } from './theme'; 


function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();

  // si estás en "/", mostramos solo el login (sin sidebar/topbar)
  const isLoginPage = location.pathname === "/";

  return (
    <ColorModelContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isLoginPage && <Sidebar />}
          <main className="content">
            {!isLoginPage && <Topbar />}

            <Routes>
              {/* LOGIN */}
              <Route path="/" element={<Login />} />

              {/* RUTAS DE LA APP */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/form" element={<Form />} />
              <Route path="/consultas" element={<Consultas />} />
              <Route path="/liquidacion" element={<Liquidacion />} />
              <Route path="/anticipos" element={<Anticipos />} />
              <Route path="/aprobacionanticipos" element={<AprobacionAnticipos />} />
              <Route path="/aprobacionanticiposDIFA" element={<AprobacionAnticiposDIFA />} />
              {/* opcional: cualquier ruta desconocida que te mande al login */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModelContext.Provider>
  );
}

export default App;