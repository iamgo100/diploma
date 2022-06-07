let appointments = await fetch('/office/get/appointments/').then(res => res.json());

// отрисовка записей на день
export const renderAppointments = (day) => {
    let code = '';
    let requiredAppointments = appointments.filter(el => day.getDate() == el.date[2] && day.getMonth() == el.date[1]-1 && day.getFullYear() == el.date[0]);
    requiredAppointments.forEach(el => {
        if (el.shift === 'None') {
            code += '<div class="appointment centered-cont unconfirmed"'
        } else {
            code += '<div class="appointment centered-cont confirmed"'
        };
        code += ` data-id="${el.id}">
        <span class="name">${el.client}</span>
        <span class="property">${el.time[0]}:${el.time[1]}</span>
        <span class="property">${el.service}</span>
        </div>`
    });
    return code;
};

const renderCost = async (id, modal) => {
    let service_cost = await fetch(`/office/get/service-${id}/cost/`).then(res => res.text());
    modal.querySelector('#cost').textContent = service_cost;
};

const renderTime = async (date, service_id, modal, initialTime='') => {
    const selectList = await fetch(
        `/office/get/appointments/time/${date}/${service_id}`)
        .then(res => res.json());
    let [val, text] = ['', ''];
    if (initialTime) {
        val = `${initialTime[0]}:${initialTime[1]}`;
        text = val;
    } else {
        val = '';
        text = '-------'
    }
    let code = `<option value="${val}">${text}</option>`
    selectList.forEach(el => {
        code += `<option value="${el[0]}:${el[1]}">${el[0]}:${el[1]}</option>`
    });
    modal.querySelector('#id_time').innerHTML = code;
};

const renderAppointmentInfo = async (currService, currDate, modal, initialTime='') => {
    const service = modal.querySelector('#id_service');
    const date = modal.querySelector('#id_date');
    if (service.value !== currService) {renderCost(service.value, modal)};
    if (service.value !== '' && date.value !== '') {
        if (service.value !== currService || date.value !== currDate)
            renderTime(date.value, service.value, modal, initialTime);
    };
    currService = service.value;
    currDate = date.value;
    return [currService, currDate]
};

const initFormChange = (modal, initialTime='') => {
    let currService = modal.querySelector('#id_service').value;
    let currDate = modal.querySelector('#id_date').value;
    modal.querySelector('form').addEventListener('change', async () => {
        [ currService, currDate ] = await renderAppointmentInfo(currService, currDate, modal, initialTime);
    });
};

export const showAppointmentForm = async (modal, role) => {
    const csrftoken = modal.querySelector('[name=csrfmiddlewaretoken]');
    let servicesData = await fetch('/office/get/services/').then(res => res.json());
    let servicesCode = ''
    servicesData.forEach(el => servicesCode += `<option value="${el.id}">${el.service}</option>`)
    const form = modal.querySelector('form');
    form.innerHTML = `
    <p>
        <label for="id_first_name">Имя клиента: </label>
        <input name="first_name" id="id_first_name">
    </p>
    <p>
        <label for="id_phone_number">Номер телефона клиента: </label>
        <input name="phone_number" id="id_phone_number">
    </p>
    <p>
        <label for="id_service">Услуга: </label>
        <select name="service" id="id_service"><option value="">--------</option>${servicesCode}</select>
    </p>
    <p>Цена услуги: <span id="cost">0</span> рублей</p>
    <p>
        <label for="id_date">Дата: </label>
        <input type="date" name="date" id="id_date">
    </p>
    <p>
        <label for="id_time">Время: </label>
        <select name="time" id="id_time"><option value="">--------</option></select>
    </p>
    `
    if (role === 'A') {
        let mastersData = await fetch('/accounts/get/masters/').then(res => res.json());
        let mastersCode = ''
        mastersData.forEach(el => mastersCode += `<option value="${el.master_id}">${el.master}</option>`)
        form.innerHTML += `
        <p>
            <label for="id_master">Мастер смены: </label>
            <select name="master" id="id_master"><option value="">--------</option>${mastersCode}</select>
        <p>
        `
    } else {
        form.querySelector('#id_date').setAttribute("disabled", "disabled");
    }
    form.prepend(csrftoken);
}

export const renderAppointmentData = async (id, modal) => {
    if (modal.querySelector('#btn-delete') === null)
        modal.querySelector('.form').innerHTML += '<button id="btn-delete">Удалить</button>';
    let res = await fetch(`/office/get/appointments/${id}`).then(res => res.json());
    let {client_name, client_phone, date, time, service_id, master_id} = res;
    renderTime(date, service_id, modal, time);
    modal.querySelector('#id_first_name').value = client_name;
    modal.querySelector('#id_phone_number').value = client_phone;
    modal.querySelector('#id_date').value = date;
    modal.querySelector('#id_time').value = `${time[0]}:${time[1]}`;
    modal.querySelector('#id_service').value = service_id;
    modal.querySelector('#id_master').value = master_id;
    renderCost(service_id, modal);
    modal.querySelector('.modal-title').textContent = 'Редактирование записи';
    const form = modal.querySelector('form');
    const deleteBtn = modal.querySelector('#btn-delete');
    const saveBtn = modal.querySelector('#btn-submit');
    saveBtn.textContent = 'Сохранить';
    saveBtn.addEventListener('click', async () => {
        const csrftoken = modal.querySelector('[name=csrfmiddlewaretoken]').value;
        let res = await fetch(`/office/post/appointments/update/${id}`, {
            method: 'POST',
            body: new FormData(form),
            headers: {'X-CSRFToken': csrftoken}
        }).then(res => res.text());
        if (res === 'Success') window.location.replace('/office/')
        else {
            console.log(res);
            modal.querySelector('#common-error').textContent = 'В форме есть ошибки. Проверьте данные формы еще раз и повторите отправку.'
        };
    });
    deleteBtn.addEventListener('click', async () => {
        const csrftoken = modal.querySelector('[name=csrfmiddlewaretoken]').value;
        let res = await fetch(`/office/post/appointments/delete/${id}`, {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken}
        }).then(res => res.text());
        if (res === 'Success') window.location.replace('/office/')
        else {
            console.log(res);
            modal.querySelector('#common-error').textContent = 'Не удалось удалить запись. Обновите страницу и попробуйте еще раз.'
        }
    });
    initFormChange(modal);
};

export const newAppointment = (date, modal) => {
    modal.querySelector('#id_date').valueAsDate = date;
    modal.querySelector('.modal-title').textContent = 'Создать запись';
    const form = modal.querySelector('form');
    const saveBtn = modal.querySelector('#btn-submit');
    saveBtn.textContent = 'Создать';
    saveBtn.addEventListener('click', async () => {
        const csrftoken = modal.querySelector('[name=csrfmiddlewaretoken]').value;
        let res = await fetch('/office/post/appointments/new/', {
            method: 'POST',
            body: new FormData(form),
            headers: {'X-CSRFToken': csrftoken}
        }).then(res => res.text());
        if (res === 'Success') window.location.replace('/office/')
        else {
            console.log(res);
            modal.querySelector('#common-error').textContent = 'В форме есть ошибки. Проверьте данные формы еще раз и повторите отправку.'
        };
    });
    initFormChange(modal);
};