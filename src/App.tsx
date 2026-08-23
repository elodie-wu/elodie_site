import { Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/SiteLayout'
import { AboutPage } from './pages/AboutPage'
import { ArchitecturePage } from './pages/ArchitecturePage'
import { HomePage } from './pages/HomePage'
import { LogsPage } from './pages/LogsPage'
import { PlayPage } from './pages/PlayPage'
import { WorkPage } from './pages/WorkPage'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="work" element={<WorkPage />} />
        <Route path="play" element={<PlayPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="architecture" element={<ArchitecturePage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  )
}
