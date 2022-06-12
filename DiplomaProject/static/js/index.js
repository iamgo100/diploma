const menu = document.querySelector('.menu-bar');
const content = document.getElementById('content');

const whereMenu = () => {
    if (window.innerWidth >= 760 && menu.parentElement.classList.contains('close')) {
        menu.parentElement.classList.toggle('open');
        menu.parentElement.classList.toggle('close');
    } else if (window.innerWidth < 760 && menu.parentElement.classList.contains('open')) {
        menu.parentElement.classList.toggle('open');
        menu.parentElement.classList.toggle('close');
    }
};
const noMenu = () => {
    if (content.style.width < '95%') content.style.width = '95%'
} 

if (menu) {
    whereMenu();
    menu.addEventListener('click', () => {
        menu.classList.toggle("change");
        menu.parentElement.classList.toggle('open');
        menu.parentElement.classList.toggle('close');
    });
    window.addEventListener('resize', whereMenu);
} else {
    noMenu();
    window.addEventListener('resize', noMenu);
}