"use strict";
import {initModal, showModal} from './modal.js';

const showServiceForm = (modal) => {
    const csrftoken = modal.querySelector('[name=csrfmiddlewaretoken]');
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
    form.innerHTML += `<div id="buttons"><button type="submit" id="btn-submit"></button></div>`;
};

const getAnswer = (res, modal) => {
    if (res === 'Success') window.location.replace('/office/admin/services/')
    else {
        console.log(res);
        const errorField = modal.querySelector('#common-error');
        if (res == 'unique_service_error') errorField.textContent = `Произошла ошибка добавления услуги.
            Услуга с таким названием уже существует. Измените название и попробуйте добавить услугу еще раз.`
        else errorField.textContent = `Произошла ошибка в поле(полях) ${res}. Проверьте правильность данных и повторите попытку.`
    };
}

const renderServiceData = (row, modal) => {
    if (modal.querySelector('#btn-delete') === null)
        modal.querySelector('#buttons').innerHTML += '<button id="btn-delete" class="btn-back">Удалить</button>';
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

const renderServicesTable = async (modal) => {
    const servicesPlace = document.getElementById('services-list');
    const servicesList = await fetch('/office/get/services/').then(res => res.json());
    let code = '';
    if (servicesList) {
        code += `<table class="service-table"><thead><tr><td>Название услуги</td><td>Цена</td><td>Длительность<br>(мин.)</td><td>Зал</td></tr></thead><tbody>`;
        for (s in servicesList) {
            code += `
            <tr data-id="${s.id}" class="srvc-row">
                <td><span class="chng-srvc">${s.name}</span></td>
                <td class="center-text">${s.cost}</td>
                <td class="center-text">${s.duration}</td>
                <td class="center-text" data-id="${s.room_id}">${s.room}</td>
            </tr>`
        };
        code += '</tbody></table>';
    } else {
        code += '<p>У вас нет ни одной предоставляемой услуги. Создайте ее прямо сейчас!</p>';
    }
    servicesPlace.innerHTML = code;
    if (servicesList) {
        document.querySelector('.service-table').querySelector('tbody').addEventListener('click', async ({target: t}) => {
            let row = t.closest('.chng-srvc').closest('.srvc-row');
            if (row) { // редактирование
                showServiceForm(modal);
                renderServiceData(row, modal);
                showModal(modal);
            }
        });
    }
};

const modal = initModal();
await renderServicesTable(modal);

document.getElementById('create-btn').addEventListener('click', () => {
    showServiceForm(modal);
    newService(modal);
    showModal(modal);
});