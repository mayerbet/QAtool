import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Checklist from '../pages/Checklist'
import Historico from '../pages/Historico'
import Comentarios from '../pages/Comentarios'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/checklist" element={<Checklist />} />
      <Route path="/historico" element={<Historico />} />
      <Route path="/comentarios" element={<Comentarios />} />
    </Routes>
  )
}
