export const showModal = (modal) => {
    modal.classList.remove('invisible');
    modal.classList.add('visible');
};
export const initModal = () => {
    const modal = document.querySelector('.modal-wrapper');
    const btnClose = modal.querySelector('#btn-close');
    const form = modal.querySelector('form');

    btnClose.addEventListener('click', () => {
        modal.classList.add('invisible');
        modal.classList.remove('visible');
    });
    form.addEventListener('submit', event => event.preventDefault());
    return modal;
};