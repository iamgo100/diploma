"use strict";
import {createCalendar, renderDate} from './calendar.js';
import {renderAppointments, showAppointmentForm, newAppointment} from './appointment.js';
import {initModal, showModal} from './modal.js';
const unconfirmedShiftsList = document.getElementById('unconfirmed-shifts');
const shiftsCalendar = document.getElementById('shifts');
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

// отрисовка списка непринятых смен
const renderUnconfirmedShifts = async () => {
    const unconfirmedShifts = await fetch('/office/get/shifts/N/').then(res => res.json());
    if (unconfirmedShifts.length !== 0) {
        let code = '';
        unconfirmedShifts.forEach(el => {
            code += `<li data-id="${el.id}">
            <span class="list-symbol">•</span>
            <span>Смена от ${el.date[0]}-${el.date[1]}-${el.date[2]} в зале "${el.room}"</span>
            <button class="confirm">Принять</button></li>`;
        });
        unconfirmedShiftsList.innerHTML = `<h3>Список непринятых смен</h3><ul>${code}</ul>`;
    }
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
    await renderUnconfirmedShifts();
    shifts = await fetch('/office/get/shifts/S/').then(res => res.json());
    createCalendar(shiftsCalendar, 'Календарь смен', renderDate, renderShiftsAndAppointments);
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
};

let shifts = [];
const modal = initModal();
await renderData();

// обработка нажатий на календарь
shiftsCalendar.addEventListener('click', async ({target: t}) => {
    let plus = t.closest('.plus');
    if (plus) { // добавление
        if (plus.parentElement.parentElement.querySelector('.shift')){
            await showAppointmentForm(modal, 'E');
            let day = Number(plus.parentElement.lastElementChild.textContent);
            let date = new Date(renderDate.year, renderDate.month, day+1);
            newAppointment(date, modal);
            showModal(modal);
        } else alert('Вы не можете создать запись на эту дату. Обратитесь к администратору салона.')
    };
});