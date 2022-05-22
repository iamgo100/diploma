"use strict";
import {createCalendar} from './calendar.js';
// import {} from './shift_modal';
const shifts = JSON.parse(JSON.parse(document.getElementById('shifts-calendar').textContent));
const shiftsCalendar = document.getElementById('shifts');
const appointmentsCalendar = document.getElementById('appointments');

// отрисовка смен на день
const renderShifts = (day) => {
    let code = '';
    let requiredShifts = shifts.filter(el => day.getDate() == el.day && day.getMonth() == el.month-1 && day.getFullYear() == el.year);
    requiredShifts.forEach(el => {
        if (el.status === 'N'){
            code = code + '<span class="master unconfirmed"';
        } else {
            code = code + '<span class="master confirmed"';
        };
        code = code + ` data-id="${el.id}">${el.master}<span class="room">${el.room}</span></span>`;
    });
    return code;
};

createCalendar(shiftsCalendar, 'Календарь смен', renderShifts);
createCalendar(appointmentsCalendar, 'Календарь записей');

shiftsCalendar.addEventListener('click', ({target: t}) => {
    let shift = t.closest('.master');
    if (shift) {
        console.log(shift.dataset.id);
    };
});