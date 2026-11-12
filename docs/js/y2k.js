// Y2K skin extras: visit counter, sparkle cursor trail, Konami code easter egg.
(function () {
    const body = document.body;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Visit counter: counts this browser's own visits, so the number is real.
    const counter = document.getElementById('y2k-counter');
    if (counter) {
        let visits = 1;
        try {
            visits = (parseInt(localStorage.getItem('y2k-visits'), 10) || 0) + 1;
            localStorage.setItem('y2k-visits', String(visits));
        } catch (e) { /* storage blocked: show 1 */ }
        counter.textContent = String(visits).padStart(7, '0');
    }

    // Sparkle trail (mouse only, skipped for reduced motion)
    if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        let last = 0;
        document.addEventListener('pointermove', event => {
            if (event.timeStamp - last < 45) return;
            last = event.timeStamp;
            const sparkle = document.createElement('span');
            sparkle.className = 'y2k-sparkle';
            sparkle.setAttribute('aria-hidden', 'true');
            sparkle.textContent = Math.random() > 0.5 ? '✦' : '★';
            sparkle.style.left = `${event.clientX}px`;
            sparkle.style.top = `${event.clientY}px`;
            body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 900);
        });
    }

    // Konami code (physical keys, so Caps Lock and non-QWERTY layouts work)
    const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let position = 0;
    document.addEventListener('keydown', event => {
        if (event.target.matches?.('input, select, textarea')) return;
        if (event.code === sequence[position]) {
            position++;
        } else {
            position = event.code === sequence[0] ? (position === 2 ? 2 : 1) : 0;
        }
        if (position === sequence.length) {
            position = 0;
            godMode();
        }
    });

    // Touch fallback: tap the @0xmoose handle five times
    const handle = document.querySelector('.site-header h1 span');
    let taps = 0;
    let tapTimer = 0;
    handle?.addEventListener('click', () => {
        taps++;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => { taps = 0; }, 1500);
        if (taps >= 5) {
            taps = 0;
            godMode();
        }
    });

    function godMode() {
        body.classList.remove('y2k-godmode');
        void body.offsetWidth; // restart the animation
        body.classList.add('y2k-godmode');
        const toast = document.createElement('div');
        toast.className = 'y2k-toast';
        toast.setAttribute('role', 'status');
        toast.textContent = 'Moose mode unlocked. +30 lives.';
        body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
            body.classList.remove('y2k-godmode');
        }, 2600);
    }
})();
