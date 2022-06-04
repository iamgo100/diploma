const timeSelect = document.getElementById('id_time');
const form = document.querySelector('.form').querySelector('form');
const service = document.getElementById('id_service');
const date = document.getElementById('id_date');
const errorMessage = document.getElementById('error-mess');
const helpMessage = document.getElementById('help-mess');
const cost = document.getElementById('cost');
const bntSubmit = document.getElementById('sub');

const renderInfo = async () => {
    if (service.value !== currService) {
        let service_cost = await fetch(`/office/get/service-${service.value}/cost/`).then(res => res.text());
        cost.textContent = service_cost;
    }
    if (service.value !== '' && date.value !== '') {
        if (service.value !== currService || date.value !== currDate) {
            let dateValue = date.value.split('.')
            if (dateValue.length === 3) {
                const selectList = await fetch(
                    `/office/get/appointments/time/${dateValue[2]}-${dateValue[1]}-${dateValue[0]}/${service.value}`)
                    .then(res => res.json());
                let code = '<option value="0">-------</option>'
                selectList.forEach(el => {
                    code += `<option value="${el[0]}:${el[1]}">${el[0]}:${el[1]}</option>`
                });
                timeSelect.innerHTML = code;
                timeSelect.parentElement.classList.remove('hidden');
                helpMessage.classList.add('hidden');
            } else {
                errorMessage.textContent = 'Неверно введена дата. Следуйте шаблону.'
            };
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
bntSubmit.addEventListener('click', () => form.submit());