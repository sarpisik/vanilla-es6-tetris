import 'normalize.css'
import './index.css'

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!')
}

// Registering Our Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration)
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}
