"use strict";
import {createCalendar, renderDate} from './calendar.js';
import {renderAppointments} from './appointment.js';
import {initModal, showModal} from './modal.js';
import { showShiftForm, newShift, renderShiftData } from './shift.js';
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

const modal = initModal();
const shifts = await fetch('/office/get/shifts/all/').then(res => res.json());
createCalendar(shiftsCalendar, 'Календарь смен', renderDate, renderShifts);
createCalendar(appointmentsCalendar, 'Календарь записей', renderDate, renderAppointments);

// обработка нажатий на календарь смен
shiftsCalendar.addEventListener('click', async ({target: t}) => {
    let shift = t.closest('.master');
    let plus = t.closest('.plus');
    if (shift) { // редактирование
        await showShiftForm(modal);
        renderShiftData(shift.dataset.id, modal);
        showModal(modal);
    } else if (plus) { // добавление
        let day = Number(plus.parentElement.lastElementChild.textContent);
        await showShiftForm(modal);
        let date = new Date(renderDate.year, renderDate.month, day+1)
        newShift(date, modal);
        showModal(modal);
    };
});

// обработка нажатий на календарь записей
appointmentsCalendar.addEventListener('click', async ({target: t}) => {
    let appointment = t.closest('.appointment');
    let plus = t.closest('.plus');
    if (appointment) { // редактирование
        console.log(appointment.dataset.id);
        let res = await fetch(`/office/get/appointments/${appointment.dataset.id}`).then(res => res.json());
        console.log(res)
        showModal(modal);
    } else if (plus) { // добавление
        let day = plus.parentElement.lastElementChild.textContent;
        console.log(day, renderDate.month+1, renderDate.year);
        showModal(modal);
    };
});