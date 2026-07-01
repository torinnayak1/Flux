import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FluxProvider } from './context/FluxContext'
import Layout from './components/Layout'
import TodayPage from './pages/Today'
import WorkoutListPage from './pages/WorkoutList'
import WorkoutDetailPage from './pages/WorkoutDetail'
import DashboardPage from './pages/Dashboard'
import PantryPage from './pages/Pantry'
import ProfilePage from './pages/Profile'

export default function App() {
  return (
    <FluxProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<TodayPage />} />
            <Route path="/workout" element={<WorkoutListPage />} />
            <Route path="/workout/:id" element={<WorkoutDetailPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/pantry" element={<PantryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FluxProvider>
  )
}
