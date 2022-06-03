// const appointments = JSON.parse(JSON.parse(document.getElementById('appointments-calendar').textContent));

let appointments = await fetch('/office/get/appointments/');
appointments = await appointments.json();

// отрисовка записей на день
export const renderAppointments = (day) => {
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