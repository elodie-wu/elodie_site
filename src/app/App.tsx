import type { ComponentType } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { pageRoutes, type PageId } from '../config/site'
import { SiteLayout } from './layout/SiteLayout'
import { AboutPage } from '../pages/about/AboutPage'
import { ArchitecturePage } from '../pages/architecture/ArchitecturePage'
import { HomePage } from '../pages/home/HomePage'
import { LogsPage } from '../pages/logs/LogsPage'
import { PlayPage } from '../pages/play/PlayPage'
import { WorkPage } from '../pages/work/WorkPage'

const pages: Record<PageId, ComponentType> = {
  home: HomePage, work: WorkPage, play: PlayPage,
  logs: LogsPage, about: AboutPage, architecture: ArchitecturePage,
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        {pageRoutes.map((route) => {
          const Page = pages[route.id]
          return <Route key={route.id} path={route.path} element={<Page />} />
        })}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
