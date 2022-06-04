"use strict";
import {createCalendar, renderDate} from './calendar.js';
import {renderAppointments} from './appointment.js';
const unconfirmedShiftsList = document.getElementById('unconfirmed-shifts');
const shiftsCalendar = document.getElementById('shifts');
const appointmentsCalendar = document.getElementById('appointments');
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

// отрисовка списка непринятых смен
const renderUnconfirmedShifts = async () => {
    const unconfirmedShifts = await fetch('/office/get/shifts/N/').then(res => res.json());
    if (unconfirmedShifts.length !== 0) {
        let code = '';
        unconfirmedShifts.forEach(el => {
            code += `<li data-id="${el.id}"><span class="list-symbol">•</span><span>Смена от ${el.date[0]}-${el.date[1]}-${el.date[2]} в зале "${el.room}"</span><button class="confirm">Принять</button></li>`;
        });
        unconfirmedShiftsList.innerHTML = `<h3>Список непринятых смен</h3><ul>${code}</ul>`;
    }
};

// отрисовка смен на день
const renderShifts = (day) => {
    let code = '';
    let requiredShifts = shifts.filter(el => day.getDate() == el.date[2] && day.getMonth() == el.date[1]-1 && day.getFullYear() == el.date[0]);
    requiredShifts.forEach(el => {
        code += `<div class="shift confirmed" data-id="${el.id}">${el.room}</div>`;
    });
    return code;
};

const renderData = async () => {
    await renderUnconfirmedShifts();
    shifts = await fetch('/office/get/shifts/S/').then(res => res.json());
    createCalendar(shiftsCalendar, 'Календарь смен', renderDate, renderShifts);
    createCalendar(appointmentsCalendar, 'Календарь записей', renderDate, renderAppointments);
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
await renderData();

// обработка нажатий на календарь смен
shiftsCalendar.addEventListener('click', ({target: t}) => {
    let shift = t.closest('.shift');
    let plus = t.closest('.plus');
    if (shift) { // редактирование
        console.log(shift.dataset.id);
    } else if (plus) { // добавление
        let day = plus.parentElement.lastElementChild.textContent;
        console.log(day, renderDate.month+1, renderDate.year);
    };
});

// обработка нажатий на календарь записей
appointmentsCalendar.addEventListener('click', ({target: t}) => {
    let appointment = t.closest('.appointment');
    if (appointment) { // редактирование
        console.log(appointment.dataset.id);
    }
});