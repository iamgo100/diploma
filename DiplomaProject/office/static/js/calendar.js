const months = {0: "Январь", 1: "Февраль", 2: "Март", 3: "Апрель", 4: "Май", 5: "Июнь", 6: "Июль", 7: "Август", 8: "Сентябрь", 9: "Октябрь", 10: "Ноябрь", 11: "Декабрь"}
const daysOfTheWeek = {0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5}

const getRenderDate = (date) => {
    return {day: date.getDate(), month: date.getMonth(), year: date.getFullYear()}
}

// отрисовка дня календаря
const renderDay = (day, today, startMonth) => {
    let code = '';
    if (day.getDate() === today.day && day.getMonth() === today.month && day.getFullYear() === today.year){
        code = code + '<div class="wrapper"><span class="today day">';
    } else if (day.getMonth() !== startMonth) {
        code = code + '<div class="wrapper"><span class="notthismonth day">';
    } else {
        code = code + '<div class="wrapper"><span class="day">';
    };
    code = code + day.getDate() + '</span></div>';
    return code;
}

const renderCalendar = ({month: startMonth, year: startYear}, somethingelse) => {
    const today = getRenderDate(new Date());
    let start = new Date(startYear, startMonth, 1);
    let wday = daysOfTheWeek[start.getDay()];
    let day = new Date(startYear, startMonth, 1-wday);
    let code = '';
    for (let i = 0; i < 5; i++) {
        code = code + '<tr>';
        for (let j = 0; j < 7; j++){
            code = code + '<td><div class="cell">' + renderDay(day, today, startMonth) + somethingelse(day) + '</div></td>';
            day = new Date(day.getFullYear(), day.getMonth(), day.getDate()+1);
        };
        code = code + '</tr>';
    };
    if (day.getMonth() === startMonth && day.getDate() < new Date(day.getFullYear(), day.getMonth()+1, 0).getDate()) {
        code = code + '<tr>';
        for (let j = 0; j < 7; j++){
            code = code + '<td><div class="cell">' + renderDay(day, today, startMonth) + somethingelse(day) + '</div></td>';
            day = new Date(day.getFullYear(), day.getMonth(), day.getDate()+1);
        };
        code = code + '</tr>';
    };
    return code;
}

// создание рендера календаря и его навигации
export const createCalendar = (calendarNode, title='Календарь', somethingelse=(...args)=>{return ''}) => {
    const calendarBody = calendarNode.querySelector('tbody');
    const calendarBtns = calendarNode.querySelectorAll('button');
    const dateText = calendarNode.querySelector('span').querySelector('span');

    calendarNode.querySelector('h2').textContent = title;

    let renderDate = getRenderDate(new Date());
    dateText.textContent = months[renderDate.month] + " " + renderDate.year;
    calendarBody.innerHTML = renderCalendar(renderDate, somethingelse);

    calendarBtns[1].addEventListener('click', () => {
        renderDate = getRenderDate(new Date());
        dateText.textContent = months[renderDate.month] + " " + renderDate.year;
        calendarBody.innerHTML = renderCalendar(renderDate, somethingelse);
    });
    
    calendarBtns[0].addEventListener('click', () => {
        renderDate = getRenderDate(new Date(renderDate.year, renderDate.month - 1));
        dateText.textContent = months[renderDate.month] + " " + renderDate.year;
        calendarBody.innerHTML = renderCalendar(renderDate, somethingelse);
    });
    
    calendarBtns[2].addEventListener('click', () => {
        renderDate = getRenderDate(new Date(renderDate.year, renderDate.month + 1));
        dateText.textContent = months[renderDate.month] + " " + renderDate.year;
        calendarBody.innerHTML = renderCalendar(renderDate, somethingelse);
    });
}