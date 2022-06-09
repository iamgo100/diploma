const timeSelect = document.getElementById('id_time');
const form = document.querySelector('.form').querySelector('form');
const service = document.getElementById('id_service');
const date = document.getElementById('id_date');
const errorMessageTime = document.getElementById('error-mess-time');
const helpMessage = document.getElementById('help-mess');
const cost = document.getElementById('cost');
const btnSubmit = document.getElementById('sub');

const renderInfo = async () => {
    if (date.type !== 'date'){
        date.type = 'date'
    }
    if (service.value !== currService) {
        let service_cost = await fetch(`/office/get/service-${service.value}/cost/`).then(res => res.ok ? res.text() : 'Ошибка получения данных');
        cost.textContent = service_cost;
    }
    if (service.value !== '' && date.value !== '') {
        if (service.value !== currService || date.value !== currDate) {
            const selectList = await fetch(
                `/office/get/appointments/time/${date.value}/${service.value}`)
                .then(res => res.ok ? res.json() : 'Ошибка получения данных');
            let code = '<option value="0">-------</option>'
            if (selectList != 'Ошибка получения данных') {
                selectList.forEach(el => {
                    code += `<option value="${el[0]}:${el[1]}">${el[0]}:${el[1]}</option>`
                });
            } else code += '<option value="ошибка">ошибка получения данных</option>';
            timeSelect.innerHTML = code;
            timeSelect.parentElement.classList.remove('hidden');
            helpMessage.classList.add('hidden'); 
        };
    };
    currService = service.value;
    currDate = date.value;
};

let currService = '';
let currDate = '';
await renderInfo();

form.addEventListener('change', renderInfo);
form.addEventListener('submit', event => event.preventDefault());
btnSubmit.addEventListener('click', () => {
    if (timeSelect.value != 0) {
        form.submit()
    } else {
        errorMessageTime.textContent = 'Выберите время вашей записи.'
    }
});