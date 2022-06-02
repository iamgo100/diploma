"use strict";
import {createCalendar, renderDate} from './calendar.js';
// import {} from './shift_modal';
const shifts = JSON.parse(JSON.parse(document.getElementById('shifts-calendar').textContent));
const appointments = JSON.parse(JSON.parse(document.getElementById('appointments-calendar').textContent));
const shiftsCalendar = document.getElementById('shifts');
const appointmentsCalendar = document.getElementById('appointments');

// отрисовка смен на день
const renderShifts = (day) => {
    let code = '';
    let requiredShifts = shifts.filter(el => day.getDate() == el.date[2] && day.getMonth() == el.date[1]-1 && day.getFullYear() == el.date[0]);
    requiredShifts.forEach(el => {
        if (el.status === 'N'){
            code = code + '<div class="master centered-cont unconfirmed"';
        } else {
            code = code + '<div class="master centered-cont confirmed"';
        };
        code = code + ` data-id="${el.id}"><span class="name">${el.master}</span><span class="property">${el.room}</span></div>`;
    });
    return code;
};

// отрисовка записей на день
const renderAppointments = (day) => {
    let code = '';
    let requiredAppointments = appointments.filter(el => day.getDate() == el.date[2] && day.getMonth() == el.date[1]-1 && day.getFullYear() == el.date[0]);
    requiredAppointments.forEach(el => {
        if (el.shift === 'None') {
            code = code + '<div class="appointment centered-cont unconfirmed"'
        } else {
            code = code + '<div class="appointment centered-cont confirmed"'
        };
        code = code + ` data-id="${el.id}">
        <div class="inline-cont">
            <span class="property">${el.time[0]}:${el.time[1]}</span>
            <span class="name">${el.client}</span>
        </div>
        <span class="property">${el.service}</span>
        </div>`
    });
    return code;
};

createCalendar(shiftsCalendar, 'Календарь смен', renderShifts);
createCalendar(appointmentsCalendar, 'Календарь записей', renderAppointments);

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