import { AppProvider } from './context/AppContext';
import CuantoTeDeboDivider from './pages/CuantoTeDeboDivider';
import './index.css';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 py-2">
        <CuantoTeDeboDivider />
      </div>
    </AppProvider>
  );
}

export default App;
