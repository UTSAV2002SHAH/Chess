import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { Auth0Provider } from '@auth0/auth0-react';

// console.log(<App />);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-m87qd2r0ulbhtr0o.us.auth0.com"
      clientId="6AojJYqYVhlWWH5ULTjIbZVgpespTURF"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}>
      <App />
    </Auth0Provider>
  </StrictMode>
);
