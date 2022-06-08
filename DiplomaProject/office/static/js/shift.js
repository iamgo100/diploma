const getAnswer = (res, modal) => {
    if (res === 'Success') window.location.replace('/office/')
    else {
        console.log(res);
        const errorField = modal.querySelector('#common-error');
        if (res == 'unique_shift_error') errorField.textContent = `Произошла ошибка добавления смены.
            Смена с такими значениями полей Дата и Мастер смены уже существует.`
        else errorField.textContent = `Произошла ошибка отправки данных. Проверьте правильность данных и повторите попытку.`
    };
};

export const renderShiftData = async (id, modal) => {
    if (modal.querySelector('#btn-delete') === null)
        modal.querySelector('#buttons').innerHTML += '<button id="btn-delete" class="btn-back">Удалить</button>';
    let {date, master_id, room_id} = await fetch(`/office/get/shifts/${id}`).then(res => res.json());
    modal.querySelector('#id_date').value = date;
    modal.querySelector('.modal-title').textContent = 'Редактирование смены';
    modal.querySelector('#id_master').value = master_id;
    modal.querySelector('#id_room').value = room_id;
    const form = modal.querySelector('form');
    const deleteBtn = modal.querySelector('#btn-delete');
    const saveBtn = modal.querySelector('#btn-submit');
    saveBtn.textContent = 'Сохранить';
    saveBtn.addEventListener('click', async () => {
        if (form.checkValidity()){
            const csrftoken = modal.querySelector('[name=csrfmiddlewaretoken]').value;
            let res = await fetch(`/office/post/shifts/update/${id}`, {
                method: 'POST',
                body: new FormData(form),
                headers: {'X-CSRFToken': csrftoken}
            }).then(res => res.text());
            getAnswer(res, modal);
        }
    });
    deleteBtn.addEventListener('click', async () => {
        const csrftoken = modal.querySelector('[name=csrfmiddlewaretoken]').value;
        let res = await fetch(`/office/post/shifts/delete/${id}`, {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken}
        }).then(res => res.text());
        if (res === 'Success') window.location.replace('/office/')
        else {
            console.log(res);
            modal.querySelector('#common-error').textContent = 'Не удалось удалить запись. Обновите страницу и попробуйте еще раз.'
        }
    })
}

export const newShift = (date, modal) => {
    modal.querySelector('#id_date').valueAsDate = date;
    modal.querySelector('.modal-title').textContent = 'Создать смену';
    const form = modal.querySelector('form');
    const saveBtn = modal.querySelector('#btn-submit');
    saveBtn.textContent = 'Создать';
    saveBtn.addEventListener('click', async () => {
        if (form.checkValidity()){
            const csrftoken = modal.querySelector('[name=csrfmiddlewaretoken]').value;
            let res = await fetch('/office/post/shifts/new/', {
                method: 'POST',
                body: new FormData(form),
                headers: {'X-CSRFToken': csrftoken}
            }).then(res => res.text());
            getAnswer(res, modal);
        }
    });
};

export const showShiftForm = async (modal) => {
    let mastersData = await fetch('/accounts/get/masters/').then(res => res.json());
    let mastersCode = ''
    mastersData.forEach(el => mastersCode += `<option value="${el.master_id}">${el.master}</option>`)
    const csrftoken = modal.querySelector('[name=csrfmiddlewaretoken]');
    const form = modal.querySelector('form');
    form.innerHTML = `
    <p>
        <label for="date">Дата: </label>
        <input type="date" name="date" id="id_date" required>
    </p>
    <p>
        <label for="master">Мастер смены: </label>
        <select name="master" id="id_master" required>
            <option value="" selected>--------</option>
            ${mastersCode}
        </select>
        <span class="errorlist" id="error-mess-master"></span>
    </p>
    <p>
        <label for="room">Зал: </label>
        <select name="room" id="id_room" required>
            <option value="1" selected>Парикмахерский</option>
            <option value="2">Маникюрный</option>
        </select>
    </p>
    `
    form.prepend(csrftoken);
    form.innerHTML += `<div id="buttons"><button type="submit" id="btn-submit"></button></div>`;
};