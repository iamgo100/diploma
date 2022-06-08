export const showModal = (modal) => {
    modal.classList.remove('invisible');
    modal.classList.add('visible');
};
export const initModal = () => {
    const modal = document.querySelector('.modal-wrapper');
    const btnClose = modal.querySelector('#btn-close');
    const form = modal.querySelector('form');
    const data = modal.querySelector('.data');

    btnClose.addEventListener('click', () => {
        modal.classList.add('invisible');
        modal.classList.remove('visible');
        modal.querySelector('#common-error').textContent = '';
        if (!data.classList.contains('invisible')) {
            data.classList.add('invisible');
            modal.querySelector('.form').classList.remove('invisible');
        };
    });
    form.addEventListener('submit', event => event.preventDefault());
    return modal;
};