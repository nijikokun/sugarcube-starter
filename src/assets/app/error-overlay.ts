export function initErrorOverlay() {
    console.log('[ErrorOverlay] Script loaded');

    const overlayId = 'tweego-error-overlay';

    function getOverlay() {
        return document.getElementById(overlayId);
    }

    function createOverlay() {
        if (getOverlay()) return;

        const overlay = document.createElement('div');
        overlay.id = overlayId;
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: '#ff5555',
            zIndex: '99999',
            padding: '2rem',
            boxSizing: 'border-box',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '16px',
            whiteSpace: 'pre-wrap',
            display: 'none',
        });

        document.body.appendChild(overlay);
    }

    function showError(message: string) {
        createOverlay();
        const overlay = getOverlay();
        if (overlay) {
            overlay.textContent = message;
            overlay.style.display = 'block';
        }
    }

    function hideError() {
        const overlay = getOverlay();
        if (overlay) {
            overlay.style.display = 'none';
            overlay.textContent = '';
        }
    }

    // Poll for BrowserSync socket
    // Poll for BrowserSync socket
    const checkInterval = setInterval(() => {
        // @ts-ignore
        const bs = window.___browserSync___;
        if (bs && bs.socket) {
            clearInterval(checkInterval);

            bs.socket.on('tweego:error', (data: { message: string }) => {
                showError(data.message);
            });

            bs.socket.on('tweego:success', () => {
                hideError();
            });
        }
    }, 100);
}
