const shifts = JSON.parse(JSON.parse(document.getElementById('shifts-calendar').textContent));
const shiftsCalendar = document.getElementById('shifts');
const appointmentsCalendar = document.getElementById('appointments');

// отрисовка мастеров на день
const renderMasters = (requiredShifts, day) => {
    let code = '';
    requiredShifts.forEach(el => {
        if (day.getDate() == el.day && day.getMonth() == el.month-1 && day.getFullYear() == el.year){
            if (el.status === 'N'){
                code = code + '<span class="master unconfirmed">';
            } else {
                code = code + '<span class="master confirmed">';
            };
            code = code + el.master;
            code = code + '</span>'; 
        };
    });
    return code;
};

const renderShifts = (day, startMonth, startYear) => {
    let requiredShifts = shifts.filter(el => el.month -1 == startMonth && el.year == startYear);
    return renderMasters(requiredShifts, day);
};

createCalendar(shiftsCalendar, 'Календарь смен', renderShifts);
createCalendar(appointmentsCalendar);