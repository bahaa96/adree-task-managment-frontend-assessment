import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Layout } from './components/Layout/Layout'
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner'

// Lazy load pages for route-based code splitting
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard').then(module => ({ default: module.Dashboard })))
const Tasks = lazy(() => import('./pages/Tasks/Tasks').then(module => ({ default: module.Tasks })))

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}

export default App
