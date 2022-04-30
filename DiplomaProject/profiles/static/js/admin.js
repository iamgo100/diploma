const shiftsCalendar = JSON.parse(document.getElementById('shifts-calendar').textContent);
const shiftsBody = document.getElementById('shiftsbody');
const btnToday = document.getElementById('today');
const btnBack = document.getElementById('back');
const btnNext = document.getElementById('next');
const dateText = document.getElementById('date');

const months = {0: "Январь", 1: "Февраль", 2: "Март", 3: "Апрель", 4: "Май", 5: "Июнь", 6: "Июль", 7: "Август", 8: "Сентябрь", 9: "Октябрь", 10: "Ноябрь", 11: "Декабрь"}
const daysOfTheWeek = {0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5}

const getToday = () => {
    const now = new Date();
    return {day: now.getDate(), month: now.getMonth(), year: now.getFullYear()}
}

const renderCalendar = (startYear, startMonth, today) => {
    let start = new Date(startYear, startMonth, 1);
    let wday = daysOfTheWeek[start.getDay()];
    let day = new Date(startYear, startMonth, 1-wday);
    let code = '';
    for (let i = 0; i < 6; i++) {
        code = code + '<tr>';
        for (let j = 0; j < 7; j++){
            if (day.getDate() === today.day && day.getMonth() === today.month && day.getFullYear() === today.year){
                code = code + '<td class="today">';
            } else if (day.getMonth() !== startMonth) {
                code = code + '<td class="notthismonth">';
            } else {
                code = code + '<td>';
            };
            code = code + day.getDate();
            code = code + '</td>';
            day = new Date(day.getFullYear(), day.getMonth(), day.getDate()+1);
        };
        code = code + '</tr>';
    };
    shiftsBody.innerHTML = code;
};

console.log(shiftsCalendar);
let today = getToday();
dateText.textContent = months[today.month] + " " + today.year;
renderCalendar(today.year, today.month, today);