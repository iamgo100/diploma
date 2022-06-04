"use strict";
import {createCalendar, renderDate} from './calendar.js';
import {renderAppointments} from './appointment.js';
const shiftsCalendar = document.getElementById('shifts');
const appointmentsCalendar = document.getElementById('appointments');

// отрисовка смен на день
const renderShifts = (day) => {
    let code = '';
    let requiredShifts = shifts.filter(el => day.getDate() == el.date[2] && day.getMonth() == el.date[1]-1 && day.getFullYear() == el.date[0]);
    requiredShifts.forEach(el => {
        if (el.status === 'N'){
            code += '<div class="master centered-cont unconfirmed"';
        } else {
            code += '<div class="master centered-cont confirmed"';
        };
        code += ` data-id="${el.id}"><span class="name">${el.master}</span><span class="property">${el.room}</span></div>`;
    });
    return code;
};

const shifts = await fetch('/office/get/shifts/all/').then(res => res.json());
createCalendar(shiftsCalendar, 'Календарь смен', renderDate, renderShifts);
createCalendar(appointmentsCalendar, 'Календарь записей', renderDate, renderAppointments);

// обработка нажатий на календарь смен
shiftsCalendar.addEventListener('click', ({target: t}) => {
    let shift = t.closest('.master');
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
    let plus = t.closest('.plus');
    if (appointment) { // редактирование
        console.log(appointment.dataset.id);
    } else if (plus) { // добавление
        let day = plus.parentElement.lastElementChild.textContent;
        console.log(day, renderDate.month+1, renderDate.year);
    };
});