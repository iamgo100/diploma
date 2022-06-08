"use strict";
import {initModal, showModal} from './modal.js';

const showServiceForm = (modal) => {
    const csrftoken = modal.querySelector('[name=csrfmiddlewaretoken]');
    const buttons = modal.querySelector('#buttons');
    const form = modal.querySelector('form');
    form.innerHTML = `
    <p>
        <label for="id_service_name">Название услуги: </label>
        <input type="text" name="service_name" maxlength="100" required id="id_service_name">
        <span class="helptext">Название должно быть уникальным.</span>
    </p>
    <p>
        <label for="id_cost">Цена: </label>
        <input type="number" name="cost" step="0.01" required id="id_cost">
    </p>
    <p>
        <label for="id_duration">Длительность: </label>
        <input type="number" name="duration" required id="id_duration">
        <span class="helptext">Введите длительность услуги в минутах.</span>
    </p>
    <p>
        <label for="id_room">Зал: </label>
        <select name="room" required id="id_room">
            <option value="" selected>---------</option>
            <option value="1">Парикмахерский</option>
            <option value="2">Маникюрный</option>
        </select>
    </p>
    `
    form.prepend(csrftoken);
    form.append(buttons);
};

const getAnswer = (res, modal) => {
    if (res === 'Success') window.location.replace('/office/admin/services/')
    else {
        console.log(res);
        modal.querySelector('#common-error').textContent = `Произошла ошибка в поле(полях) ${res}.
        Проверьте правильность данных и повторите попытку.`
    };
}

const renderServiceData = (row, modal) => {
    if (modal.querySelector('#btn-delete') === null)
        modal.querySelector('#buttons').innerHTML += '<button id="btn-delete">Удалить</button>';
    const values = row.childNodes;
    modal.querySelector('#id_service_name').value = values[0].textContent;
    modal.querySelector('#id_cost').value = parseFloat(values[1].textContent);
    modal.querySelector('#id_duration').value = values[2].textContent;
    modal.querySelector('#id_room').value = values[3].dataset.id;
    modal.querySelector('.modal-title').textContent = 'Редактирование услуги';
    const form = modal.querySelector('form');
    const deleteBtn = modal.querySelector('#btn-delete');
    const saveBtn = modal.querySelector('#btn-submit');
    saveBtn.textContent = 'Сохранить';
    saveBtn.addEventListener('click', async () => {
        if (form.checkValidity()){
            const csrftoken = modal.querySelector('[name=csrfmiddlewaretoken]').value;
            let res = await fetch(`/office/post/service/update/${row.dataset.id}`, {
                method: 'POST',
                body: new FormData(form),
                headers: {'X-CSRFToken': csrftoken}
            }).then(res => res.text());
            getAnswer(res, modal);
        };
    });
    deleteBtn.addEventListener('click', async () => {
        const csrftoken = modal.querySelector('[name=csrfmiddlewaretoken]').value;
        let res = await fetch(`/office/post/service/delete/${row.dataset.id}`, {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken}
        }).then(res => res.text());
        if (res === 'Success') window.location.replace('/office/admin/services/')
        else {
            console.log(res);
            modal.querySelector('#common-error').textContent = 'Не удалось удалить запись. Обновите страницу и попробуйте еще раз.'
        }
    })
};

const newService = (modal) => {
    modal.querySelector('.modal-title').textContent = 'Новая услуга';
    const form = modal.querySelector('form');
    const saveBtn = modal.querySelector('#btn-submit');
    console.log(modal);
    saveBtn.textContent = 'Создать';
    saveBtn.addEventListener('click', async () => {
        if (form.checkValidity()){
            const csrftoken = modal.querySelector('[name=csrfmiddlewaretoken]').value;
            let res = await fetch('/office/post/service/new/', {
                method: 'POST',
                body: new FormData(form),
                headers: {'X-CSRFToken': csrftoken}
            }).then(res => res.text());
            getAnswer(res, modal);
        }
    });
};

const modal = initModal();
const serviceTableBody = document.querySelector('.service-table').querySelector('tbody');
const createBtn = document.getElementById('create-btn');

serviceTableBody.addEventListener('click', async ({target: t}) => {
    let row = t.closest('.chng-srvc').closest('.srvc-row');
    if (row) { // редактирование
        showServiceForm(modal);
        renderServiceData(row, modal);
        showModal(modal);
    }
});
createBtn.addEventListener('click', () => {
    showServiceForm(modal);
    newService(modal);
    showModal(modal);
});