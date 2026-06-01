import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterStep2 from './pages/RegisterStep2'; 
import RegisterStep3 from './pages/RegisterStep3';
import RegisterStep4 from './pages/RegisterStep4';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Agregamos la ruta del paso 2 */}
        <Route path="/register/step-2" element={<RegisterStep2 />} />
        <Route path='register/step-3' element={<RegisterStep3/>}></Route>
        <Route path='register/step-4' element={<RegisterStep4/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;