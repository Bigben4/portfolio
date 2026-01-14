

const menuToggle = document.getElementById('menuToggle');
const menuid = document.getElementById('menuid');
menuToggle.addEventListener('click', () => {
    menuid.classList.toggle('open');
    menuid.classList.toggle('closed');
});

// Smooth scrolling for nav links and mobile menu behaviour
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // close mobile menu if open
                    if (menuid.classList.contains('open')) {
                        menuid.classList.remove('open');
                        menuid.classList.add('closed');
                    }
                }
            }
        });
    });

    // highlight active menu item on scroll
    const sections = document.querySelectorAll('section[id]');
    const options = { root: null, rootMargin: '0px', threshold: 0.45 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const link = document.querySelector(`.menu a[href="#${id}"]`);
            if (entry.isIntersecting) {
                document.querySelectorAll('.menu a').forEach(a => a.classList.remove('active'));
                if (link) link.classList.add('active');
            }
        });
    }, options);
    sections.forEach(sec => observer.observe(sec));

    // set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

