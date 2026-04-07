window.initAnimations = function () {
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
