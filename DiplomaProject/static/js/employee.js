"use strict";
import {createCalendar, renderDate} from './calendar.js';
import {renderAppointments, showAppointmentForm, newAppointment, showAppointmentData, getAppointments} from './appointment.js';
import {initModal, showModal} from './modal.js';
const unconfirmedShiftsList = document.getElementById('unconfirmed-shifts');
const shiftsCalendar = document.getElementById('shifts');
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

// отрисовка списка непринятых смен
const renderUnconfirmedShifts = async () => {
    const unconfirmedShifts = await fetch('/office/get/shifts/N/').then(res => res.ok ? res.json() : 'Ошибка получения данных');
    if (unconfirmedShifts != '') {
        if (unconfirmedShifts.length !== 0) {
            let code = '';
            unconfirmedShifts.forEach(el => {
                code += `<li data-id="${el.id}">
                <span class="list-symbol">•</span>
                <span>Смена от ${el.date[0]}-${el.date[1]}-${el.date[2]} в зале "${el.room}"</span>
                <button class="confirm">Принять</button></li>`;
            });
            unconfirmedShiftsList.innerHTML = `<h3>Список непринятых смен</h3><ul>${code}</ul>`;
        };
        document.querySelectorAll('.confirm').forEach(el => {
            el.addEventListener('click', async () => {
                let sh = el.parentElement.dataset.id;
                let res = await fetch(
                    `/office/post/shifts/confirm/${sh}`, 
                    {method: 'POST', headers: {'X-CSRFToken': csrftoken}})
                    .then(res => res.text());
                console.log(res);
                await renderData();
            })
        });
    } else unconfirmedShiftsList.innerHTML = `<h3>Список непринятых смен</h3><p>Ошибка получения данных</p>`;
};

// отрисовка смен и записей на день
const renderShiftsAndAppointments = (day) => {
    let code = '';
    let requiredShifts = shifts.filter(el => day.getDate() == el.date[2] && day.getMonth() == el.date[1]-1 && day.getFullYear() == el.date[0]);
    requiredShifts.forEach(el => {
        code += `<div class="shift confirmed" data-id="${el.id}">${el.room}</div>`;
    });
    code += renderAppointments(day);
    return code;
};

const renderData = async () => {
    shifts = await fetch('/office/get/shifts/S/').then(res => res.ok ? res.json() : 'Ошибка получения данных');
    await getAppointments();
    if (shifts != 'Ошибка получения данных') 
        createCalendar(shiftsCalendar, 'Календарь смен', renderDate, renderShiftsAndAppointments);
    else createCalendar(shiftsCalendar, 'Календарь смен. Ошибка получения данных');
    await renderUnconfirmedShifts();
};

let shifts = [];
await getAppointments();
const modal = initModal();
await renderData();

// обработка нажатий на календарь
shiftsCalendar.addEventListener('click', async ({target: t}) => {
    let plus = t.closest('.plus');
    let appointment = t.closest('.appointment');
    if (plus) { // добавление
        if (plus.parentElement.parentElement.querySelector('.shift')){
            await showAppointmentForm(modal, 'E');
            let date = new Date(plus.parentElement.dataset.day);
            date.setDate(date.getDate() + 1);
            newAppointment(date, modal);
            showModal(modal);
        } else alert('Вы не можете создать запись на эту дату. Обратитесь к администратору салона.')
    } else if (appointment) { // просмотр
        await showAppointmentData(appointment.dataset.id, modal);
        showModal(modal);
    }
});