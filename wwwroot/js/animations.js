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

window.initAnimations = function () {
    // Services cards reveal on scroll (when section hits top)
    const servicesSection = document.querySelector('.kf-services');
    const cardsContainer = document.querySelector('.kf-cards');

    if (servicesSection && cardsContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Trigger when the section reaches the top of viewport
                if (entry.boundingClientRect.top <= 0 && !cardsContainer.classList.contains('visible')) {
                    cardsContainer.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

        observer.observe(servicesSection);
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

    // Nav glassmorphism on scroll
    const nav = document.querySelector('.kf-nav');
    if (nav) {
        const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
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
};
