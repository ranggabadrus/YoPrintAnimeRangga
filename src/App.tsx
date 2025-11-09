import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import SearchPage from './pages/Search'
import DetailPage from './pages/Detail'

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/anime/:id" element={<DetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
