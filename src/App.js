import { ColorModelContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar"
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/Team";
// import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
// import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Liquidacion from "./scenes/liquidacion";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// import FAQ from "./scenes/faq";
// import Geography from "./scenes/geography";
import Consultas from './scenes/consultas';

function App() {

  const [theme, colorMode] = useMode();

  return (
    <ColorModelContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <div className="app">
          <Sidebar />
          <main className='content'>
            <Topbar/>
            <Routes>
                <Route path='/' element={<Dashboard/>} />
                <Route path='/team' element={<Team/>} />
                <Route path='/contacts' element={<Contacts/>} />
                <Route path='/form' element={<Form/>} />
                <Route path='/consultas' element={<Consultas/>} />               
                {/*{<Route path='/bar' element={<Bar/>} />
                <Route path='/pie' element={<Pie/>} />
                <Route path='/line' element={<Line/>} />
                <Route path='/faq' element={<FAQ/>} />
                <Route path='/geography' element={<Geography/>} />*/}
                <Route path='/liquidacion' element={<Liquidacion/>} /> 
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModelContext.Provider>
    
  );
}

export default App;
