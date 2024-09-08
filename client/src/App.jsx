import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import {
  QueryClient,
  QueryClientProvider
} from 'react-query';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme';

import Export from './pages/export';
import Record from './pages/record';
import Visualize from './pages/visualize';


function App() {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Export />} />
          <Route path="/record" element={<Record />} />
          <Route path="/visualize" element={<Visualize />} />
        </Routes>
      </Router>
      <ToastContainer />
    </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
