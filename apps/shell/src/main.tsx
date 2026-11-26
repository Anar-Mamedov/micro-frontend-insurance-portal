import '@mfd/ui/tokens.css'
import '@mfd/ui/base.css'
import type { CurrentUser } from '@mfd/contracts'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App'

// The shell owns authentication. A real portal would get the user from its identity provider;
// remotes only ever receive this object through RemoteAppProps.
const user: CurrentUser = { name: 'Aysel Məmmədova', role: 'agent' }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App user={user} />
    </BrowserRouter>
  </StrictMode>,
)
