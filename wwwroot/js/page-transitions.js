(function () {
    const curtain = document.getElementById('kf-page-transition');
    if (!curtain) return;

    const panels = Array.from(curtain.querySelectorAll('span'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reducedMotion ? 0 : 460;
    const stagger = reducedMotion ? 0 : 95;
    let navigating = false;

    function animate(panel, from, to, delay) {
        if (!duration) {
            panel.style.transform = to;
            return Promise.resolve();
        }

        const animation = panel.animate(
            [{ transform: from }, { transform: to }],
            { duration, delay, easing: 'cubic-bezier(.76, 0, .24, 1)', fill: 'forwards' }
        );
        return animation.finished.catch(function () {}).then(function () {
            animation.cancel();
            panel.style.transform = to;
        });
    }

    function movePanels(from, to) {
        return Promise.all(panels.map(function (panel, index) {
            return animate(panel, from, to, index * stagger);
        }));
    }

    document.addEventListener('click', async function (event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || navigating) return;

        const link = event.target.closest('a[href]');
        if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

        const destination = new URL(link.href, window.location.href);
        if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname && destination.search === window.location.search) return;

        event.preventDefault();
        navigating = true;
        curtain.classList.add('is-active');
        await movePanels('translateY(101%)', 'translateY(0)');

        if (window.Blazor && typeof window.Blazor.navigateTo === 'function') {
            window.Blazor.navigateTo(destination.href);
            requestAnimationFrame(function () {
                requestAnimationFrame(async function () {
                    await movePanels('translateY(0)', 'translateY(-101%)');
                    curtain.classList.remove('is-active');
                    panels.forEach(function (panel) { panel.style.transform = 'translateY(101%)'; });
                    navigating = false;
                });
            });
        } else {
            window.location.assign(destination.href);
        }
    });
})();
