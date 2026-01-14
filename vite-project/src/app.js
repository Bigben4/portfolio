

const menuToggle = document.getElementById('menuToggle');
const menuid = document.getElementById('menuid');
menuToggle.addEventListener('click', () => {
    menuid.classList.toggle('open');
    menuid.classList.toggle('closed');
});

