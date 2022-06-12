export const showModal = (modal) => {
    modal.classList.remove('invisible');
    modal.classList.add('visible');
};
export const initModal = () => {
    let isAvailable = false;
    const modal = document.querySelector('.modal-wrapper');
    const form = modal.querySelector('form');
    const data = modal.querySelector('.data');

    modal.addEventListener('mousedown', ({ target: t }) => {
        if (!t.closest('.modal') || t.closest('#btn-close')) isAvailable = true;
    });

    modal.addEventListener('mouseup', ({ target: t }) => {
        if ((!t.closest('.modal') || t.closest('#btn-close')) && isAvailable) {
            modal.classList.add('invisible');
            modal.classList.remove('visible');
            modal.querySelector('#common-error').textContent = '';
            if (!data.classList.contains('invisible')) {
                data.classList.add('invisible');
                modal.querySelector('.form').classList.remove('invisible');
            };
        }
        isAvailable = false;
    });
    form.addEventListener('submit', event => event.preventDefault());
    return modal;
};