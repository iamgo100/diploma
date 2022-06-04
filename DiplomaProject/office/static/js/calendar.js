const months = {0: "Январь", 1: "Февраль", 2: "Март", 3: "Апрель", 4: "Май", 5: "Июнь", 6: "Июль", 7: "Август", 8: "Сентябрь", 9: "Октябрь", 10: "Ноябрь", 11: "Декабрь"}
const daysOfTheWeek = {0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5}

const getRenderDate = (date) => {
    return {day: date.getDate(), month: date.getMonth(), year: date.getFullYear()}
}

// отрисовка дня календаря
const renderDay = (day, today, startMonth) => {
    let code = '<div class="wrapper"><button class="plus">+</button>';
    if (day.getDate() === today.day && day.getMonth() === today.month && day.getFullYear() === today.year){
        code += '<span class="today day">';
    } else if (day.getMonth() !== startMonth) {
        code += '<span class="notthismonth day">';
    } else {
        code += '<span class="day">';
    };
    code += day.getDate() + '</span></div>';
    return code;
}

const renderCalendar = ({month: startMonth, year: startYear}, somethingelse) => {
    const today = getRenderDate(new Date());
    let start = new Date(startYear, startMonth, 1);
    let wday = daysOfTheWeek[start.getDay()];
    let day = new Date(startYear, startMonth, 1-wday);
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += '<tr>';
        for (let j = 0; j < 7; j++){
            code += '<td><div class="cell">' + renderDay(day, today, startMonth) + somethingelse(day) + '</div></td>';
            day = new Date(day.getFullYear(), day.getMonth(), day.getDate()+1);
        };
        code += '</tr>';
    };
    if (day.getMonth() === startMonth && day.getDate() < new Date(day.getFullYear(), day.getMonth()+1, 0).getDate()) {
        code += '<tr>';
        for (let j = 0; j < 7; j++){
            code += '<td><div class="cell">' + renderDay(day, today, startMonth) + somethingelse(day) + '</div></td>';
            day = new Date(day.getFullYear(), day.getMonth(), day.getDate()+1);
        };
        code += '</tr>';
    };
    return code;
}

export let renderDate = getRenderDate(new Date());

// создание рендера календаря и его навигации
export const createCalendar = (calendarNode, title='Календарь', renderDate=renderDate, somethingelse=(...args)=>{return ''}) => {
    calendarNode.innerHTML = `
    <table class="calendar">
    <thead>
        <tr><td colspan="7"><div class="calendar-title-cont">
                    <h2>${title}</h2>
                    <span>
                        <span class="date"></span>
                        <button class="calendar-btn">﹤</button>
                        <button class="calendar-btn">Сегодня</button>
                        <button class="calendar-btn">﹥</button>
                    </span>
        </div></td></tr>
        <tr class="right bordered"><td>пн</td><td>вт</td><td>ср</td><td>чт</td><td>пт</td><td>сб</td><td>вс</td></tr>
    </thead>
    <tbody class="bordered"></tbody>
    </table>
    `;
    const calendarBody = calendarNode.querySelector('tbody');
    const calendarBtns = calendarNode.querySelectorAll('button');
    const dateText = calendarNode.querySelector('span').querySelector('span');

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