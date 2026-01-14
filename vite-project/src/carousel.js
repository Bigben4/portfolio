


document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.swiper-wrapper');
    if (!wrapper) return;

    const slides = Array.from(wrapper.children);
    const prevBtn = document.querySelector('.swiper-button-prev');
    const nextBtn = document.querySelector('.swiper-button-next');
    let index = 0;

    function update() {
        wrapper.style.transform = `translateX(-${index * 100}%)`;
    }

    function goNext() {
        index = (index + 1) % slides.length;
        update();
    }

    function goPrev() {
        index = (index - 1 + slides.length) % slides.length;
        update();
    }

    nextBtn && nextBtn.addEventListener('click', () => { goNext(); resetAutoplay(); });
    prevBtn && prevBtn.addEventListener('click', () => { goPrev(); resetAutoplay(); });

    // Autoplay
    let autoplay = setInterval(goNext, 4000);
    function resetAutoplay() {
        clearInterval(autoplay);
        autoplay = setInterval(goNext, 4000);
    }

    // Pointer / swipe support
    let startX = 0;
    wrapper.addEventListener('pointerdown', (e) => {
        startX = e.clientX;
        wrapper.style.transition = 'none';
    });
    wrapper.addEventListener('pointerup', (e) => {
        wrapper.style.transition = '';
        const diff = e.clientX - startX;
        if (Math.abs(diff) > 50) {
            if (diff < 0) goNext(); else goPrev();
            resetAutoplay();
        }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { goNext(); resetAutoplay(); }
        if (e.key === 'ArrowLeft') { goPrev(); resetAutoplay(); }
    });

    // Ensure transform is correct on load/resize
    update();
    window.addEventListener('resize', update);
});
