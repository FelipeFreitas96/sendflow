import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './modules/auth/hooks/useAuth';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from "@/components/sonner";
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
