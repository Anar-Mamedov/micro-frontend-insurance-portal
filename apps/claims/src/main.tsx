import '@mfd/ui/tokens.css'
import '@mfd/ui/base.css'
import type { CurrentUser } from '@mfd/contracts'
import { Notice, StandaloneFrame } from '@mfd/ui'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import ClaimsApp from './ClaimsApp'

// Standalone entry: the remote's own dev page. The shell never runs this file.
const developer: CurrentUser = { name: 'Local developer', role: 'admin' }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <StandaloneFrame appName="Claims">
        <Routes>
          <Route path="/claims/*" element={<ClaimsApp user={developer} />} />
          <Route
            path="/policies/*"
            element={
              <Notice title="Policies belong to another micro-frontend">
                Open the shell on port 5170 to follow links between apps.
              </Notice>
            }
          />
          <Route path="*" element={<Navigate to="/claims" replace />} />
        </Routes>
      </StandaloneFrame>
    </BrowserRouter>
  </StrictMode>,
)
