window.initKfLoader = function () {
    const loader = document.getElementById('kf-loader');
    const app = document.getElementById('app');

    if (!loader || !app) return;

    const minVisibleMs = 1800;
    const exitDurationMs = 1050;
    const startTime = performance.now();

    let visualProgress = 0;
    let realProgress = 0;
    let appReady = false;
    let hiding = false;

    document.body.classList.remove('kf-app-visible');

    const parseProgressValue = (value) => {
        const parsed = Number.parseFloat((value || '').replace('%', '').trim());
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const readBlazorProgress = () => {
        const sources = [app, document.documentElement, document.body];

        for (const source of sources) {
            if (!source) continue;

            const value = getComputedStyle(source).getPropertyValue('--blazor-load-percentage');
            const parsed = parseProgressValue(value);
            if (parsed > 0) {
                return Math.min(parsed, 100);
            }
        }

        return 0;
    };

    const hideLoader = () => {
        if (hiding) return;

        hiding = true;
        document.body.classList.add('kf-app-visible');
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                loader.classList.add('is-hiding');
            });
        });
        window.setTimeout(() => {
            loader.remove();
        }, exitDurationMs + 80);
    };

    const appObserver = new MutationObserver(() => {
        if (app.childNodes.length > 0) {
            appReady = true;
            appObserver.disconnect();
        }
    });

    appObserver.observe(app, { childList: true, subtree: true });

    const tick = () => {
        if (hiding) return;

        const elapsed = performance.now() - startTime;
        realProgress = Math.max(realProgress, readBlazorProgress());

        const stagedProgress = Math.min(94, (elapsed / minVisibleMs) * 88);
        const targetProgress = appReady
            ? 100
            : Math.max(realProgress, stagedProgress);

        const easing = appReady ? 0.12 : 0.065;
        visualProgress += (targetProgress - visualProgress) * easing;

        if (!appReady && visualProgress > 96) {
            visualProgress = 96;
        }

        const roundedProgress = Math.min(100, Math.max(0, visualProgress));
        loader.style.setProperty('--loader-progress', `${roundedProgress.toFixed(2)}%`);

        if (appReady && elapsed >= minVisibleMs && roundedProgress >= 99.4) {
            loader.style.setProperty('--loader-progress', '100%');
            hideLoader();
            return;
        }

        window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
};

if (!window.__kfLoaderInitialized) {
    window.__kfLoaderInitialized = true;
    window.initKfLoader();
}

window.initBackgroundPaths = function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 696 316');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(svg);

    function makePath(i, pos) {
        const a = -380 - i * 5 * pos, b = -189 + i * 6;
        const c = -312 - i * 5 * pos, d = 216 - i * 6;
        const e = 152 - i * 5 * pos, f = 343 - i * 6;
        const g = 616 - i * 5 * pos, h = 470 - i * 6;
        const k = 684 - i * 5 * pos, l = 875 - i * 6;
        return `M${a} ${b}C${a} ${b} ${c} ${d} ${e} ${f}C${g} ${h} ${k} ${l} ${k} ${l}`;
    }

    for (const pos of [1, -1]) {
        for (let i = 0; i < 36; i++) {
            const el = document.createElementNS(svgNS, 'path');
            el.setAttribute('d', makePath(i, pos));
            el.setAttribute('stroke', '#E8622A');
            el.setAttribute('stroke-width', String(0.5 + i * 0.03));
            el.setAttribute('fill', 'none');
            svg.appendChild(el);
            const len = el.getTotalLength();
            const seg = len * 0.25;
            const dur = (22 + Math.random() * 12) * 1000;
            const delay = Math.random() * -dur;
            const op = 0.05 + i * 0.015;
            el.animate([
                { strokeDasharray: `${seg} ${len}`, strokeDashoffset: seg,        opacity: op * 0.4 },
                { strokeDasharray: `${seg} ${len}`, strokeDashoffset: -(len * 0.4), opacity: op       },
                { strokeDasharray: `${seg} ${len}`, strokeDashoffset: -(len + seg), opacity: op * 0.4 },
            ], { duration: dur, delay, iterations: Infinity, easing: 'linear' });
        }
    }
};

// Word-by-word reveal animation with blur
window.initWordReveal = function() {
    const elements = document.querySelectorAll('[data-animate="words"]');

    elements.forEach(el => {
        const text = el.innerText;
        const words = text.split(' ');

        // Clear and rebuild with span wrappers
        el.innerHTML = words.map((word, idx) =>
            `<span style="display:inline-block;margin-right:0.25em;animation:wordReveal 0.6s ease-out forwards;animation-delay:${idx * 0.08}s;transform:translateY(30px);opacity:0;filter:blur(8px);">${word}</span>`
        ).join('');
    });
};

// Add word reveal animation keyframe if not already present
if (!document.querySelector('style[data-word-reveal]')) {
    const style = document.createElement('style');
    style.setAttribute('data-word-reveal', '');
    style.textContent = `
        @keyframes wordReveal {
            from {
                opacity: 0;
                transform: translateY(30px);
                filter: blur(8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
                filter: blur(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// 3D button hover effect
window.init3DButtons = function() {
    document.querySelectorAll('.kf-btn').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-1px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
};

window.initFloatingCallStatus = function () {
    if (window.__kfFloatingCallStatusTimer) {
        window.clearInterval(window.__kfFloatingCallStatusTimer);
        window.__kfFloatingCallStatusTimer = null;
    }

    const status = document.querySelector('.kf-floating-call-status');
    if (!status) return;

    const label = status.querySelector('.kf-floating-call-status-label');
    if (!label) return;

    const defaultLabel = status.dataset.defaultLabel || 'Svar inden for 24 timer';
    const copenhagenFormatter = new Intl.DateTimeFormat('da-DK', {
        timeZone: 'Europe/Copenhagen',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const updateStatus = () => {
        const parts = copenhagenFormatter.formatToParts(new Date());
        const getPart = (type) => Number(parts.find((part) => part.type === type)?.value || '0');
        const hour = getPart('hour');
        const minute = getPart('minute');
        const second = getPart('second');
        const secondsOfDay = (hour * 3600) + (minute * 60) + second;
        const isBusinessHours = secondsOfDay >= (7 * 3600) && secondsOfDay < (18 * 3600);
        const alternateLabel = isBusinessHours ? 'Aktiv' : 'Offline';
        const showAlternate = Math.floor(secondsOfDay / 20) % 2 === 1;

        label.textContent = showAlternate ? alternateLabel : defaultLabel;
        status.classList.toggle('is-default', !showAlternate);
        status.classList.toggle('is-active', showAlternate && isBusinessHours);
        status.classList.toggle('is-offline', showAlternate && !isBusinessHours);
    };

    updateStatus();
    window.__kfFloatingCallStatusTimer = window.setInterval(updateStatus, 1000);
};

window.initKfLocationsMap = function (containerId) {
    if (!window.maplibregl) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    window.__kfMapInstances = window.__kfMapInstances || {};

    if (window.__kfMapInstances[containerId]) {
        window.__kfMapInstances[containerId].remove();
        delete window.__kfMapInstances[containerId];
    }

    const locations = [
        { name: "Aarhus", lng: 10.2039, lat: 56.1629 },
        { name: "Aalborg", lng: 9.9217, lat: 57.0488 }
    ];

    const denmarkBounds = [
        [7.8, 54.45],
        [15.35, 57.95]
    ];

    const map = new window.maplibregl.Map({
        container: containerId,
        style: "https://tiles.openfreemap.org/styles/fiord",
        center: [11.1, 56.2],
        zoom: 5.3,
        attributionControl: false,
        cooperativeGestures: true
    });

    window.__kfMapInstances[containerId] = map;

    map.addControl(new window.maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new window.maplibregl.AttributionControl({ compact: true }), "bottom-right");
    map.scrollZoom.disable();

    locations.forEach((location) => {
        const markerElement = document.createElement("button");
        markerElement.type = "button";
        markerElement.className = "bk-map-marker";
        markerElement.setAttribute("aria-label", location.name);
        markerElement.title = location.name;

        const popup = new window.maplibregl.Popup({
            offset: 18,
            closeButton: false,
            closeOnClick: true,
            className: "bk-map-popup"
        }).setHTML(
            `<div class="bk-map-popup-card"><strong>${location.name}</strong><span>Danmark</span></div>`
        );

        new window.maplibregl.Marker({ element: markerElement, anchor: "center" })
            .setLngLat([location.lng, location.lat])
            .setPopup(popup)
            .addTo(map);
    });

    map.on("load", () => {
        map.fitBounds(denmarkBounds, {
            padding: { top: 56, right: 56, bottom: 56, left: 56 },
            maxZoom: 6.1,
            duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1200
        });

        window.requestAnimationFrame(() => map.resize());
    });
};

window.initAnimations = function () {
    const clearGhostSelection = () => {
        const selection = window.getSelection ? window.getSelection() : null;
        if (selection && selection.rangeCount > 0) {
            selection.removeAllRanges();
        }
    };

    // Services cards reveal on scroll (when section fills entire screen)
    const servicesSection = document.querySelector('.kf-services');
    const cardsContainer = document.querySelector('.kf-cards');

    if (servicesSection && cardsContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Trigger when the top of section reaches the top of viewport
                // and the entire viewport is filled with the section
                const rect = entry.boundingClientRect;
                const screenHeight = window.innerHeight;

                if (rect.top <= 0 && rect.height >= screenHeight && !cardsContainer.classList.contains('visible')) {
                    cardsContainer.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px 0px 0px' });

        observer.observe(servicesSection);
    }

    // Process intro text reveal at 10% from top
    const processIntroText = document.querySelector('.kf-process-intro-text');
    if (processIntroText) {
        const introObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    introObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        introObserver.observe(processIntroText);
    }

    // Scroll reveal with IntersectionObserver
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if (revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay || '0');
                    setTimeout(() => entry.target.classList.add('is-visible'), delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(el => observer.observe(el));
    }

    // Hide header once the page is no longer at the very top
    const nav = document.querySelector('.kf-nav');
    if (nav) {
        const onScroll = () => {
            const isAtTop = window.scrollY <= 8;
            nav.classList.toggle('scrolled', !isAtTop);
            nav.classList.toggle('kf-nav-hidden', !isAtTop);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }


    // Parallax background text
    document.querySelectorAll('.kf-parallax-text').forEach(el => {
        const section = el.parentElement;

        const updateParallax = () => {
            const rect = section.getBoundingClientRect();
            const scrolledIn = window.innerHeight - rect.top;
            const y = -scrolledIn * 0.22 + 120;
            el.style.transform = `translateX(-50%) translateY(calc(-50% + ${y}px))`;
        };

        window.addEventListener('scroll', updateParallax, { passive: true });
        window.addEventListener('resize', updateParallax, { passive: true });
        // Defer first call so Blazor layout is fully painted
        requestAnimationFrame(() => requestAnimationFrame(updateParallax));
    });

    // Stacked team cards auto-flip
    const stackCards = document.querySelectorAll('.kf-stack-card');
    if (stackCards.length === 3) {
        let current = 0;

        setInterval(() => {
            const cards = document.querySelectorAll('.kf-stack-card');
            if (!cards.length) return;

            // Mark current active as leaving
            cards[current % 3].classList.remove('active');
            cards[current % 3].classList.add('leaving');

            // Shift the other two forward
            cards[(current + 1) % 3].classList.remove('behind-1');
            cards[(current + 1) % 3].classList.add('active');

            cards[(current + 2) % 3].classList.remove('behind-2');
            cards[(current + 2) % 3].classList.add('behind-1');

            // After transition, reset the leaving card to behind-2
            const leaving = cards[current % 3];
            setTimeout(() => {
                leaving.classList.remove('leaving');
                leaving.classList.add('behind-2');
            }, 560);

            current = (current + 1) % 3;
        }, 3500);
    }

    // 3D mouse-tilt on service cards
    document.querySelectorAll('.kf-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'box-shadow 0.35s ease';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform =
                `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px) scale(1.015)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.55s ease, box-shadow 0.35s ease';
            card.style.transform = '';
            setTimeout(() => { card.style.transition = ''; }, 550);
        });
    });

    // FAQ Accordion
    document.querySelectorAll('.kf-faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.kf-faq-item');
            const isActive = item.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.kf-faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Initialize word-reveal animations
    window.initWordReveal();

    // Some browsers briefly restore a text-selection range on load/reload.
    // Clear it after paint so headings don't look highlighted.
    requestAnimationFrame(() => {
        clearGhostSelection();
        setTimeout(clearGhostSelection, 120);
    });

    // Initialize 3D button effects
    window.init3DButtons();

    // Initialize process accordion
    document.querySelectorAll('.kf-process-accordion-trigger').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.kf-process-accordion-item');
            const isActive = item.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.kf-process-accordion-item').forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Update clock in hero status
    const updateClock = () => {
        const statusText = document.querySelector('.kf-status-text');
        if (statusText && statusText.textContent.includes('Europa')) {
            // Add time counter after location
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            // Keep location and add time
            if (!statusText.textContent.includes(':')) {
                statusText.textContent = `Europa, Danmark • ${timeStr}`;
            } else {
                statusText.textContent = `Europa, Danmark • ${timeStr}`;
            }
        }
    };

    // Update clock every second
    updateClock();
    setInterval(updateClock, 1000);
};
