import "./styles/index.scss";

import { initErrorOverlay } from './error-overlay';

// Initialize error overlay in development
// Initialize error overlay
if (import.meta.env.DEV) {
    console.log('[App] Initializing error overlay');
    initErrorOverlay();
}
