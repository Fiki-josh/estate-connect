import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthProvider from './context/AuthContext.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from "./components/ui/toaster"
import ErrorFallBack from './components/shared/ErrorFallBack.jsx'
import NavBar from './components/shared/NavBar.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <ErrorBoundary FallbackComponent={ErrorFallBack}>
          <NavBar />
          <App />
          <Toaster />
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
)
