const mDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let date = new Date();
let cYear = date.getFullYear();
let cMonth = date.getMonth() + 1;
let cToday = date.getDate();

$(()=>{
    mkcalendar(cYear, cMonth);
})

$('#calendar').on('click', '.day', (e) => {
    let year = $('#year > span').text();
    let month = $('#month > span').text();
    let day = $(e.target).find('span').text();

    if (!day) return;

    console.log(year, month, day);
});

function move(dir) {
    let year = parseInt($('#year > span').text());
    let month = parseInt($("#month > span").text());

    if (dir == 'l') {
        if (month == 1){
            year--;
            month = 12;
        } else {
            month--;
        }
    } else {
        if (month == 12){
            year++;
            month = 1;
        } else {
            month++;
        }
    }
    mkcalendar(year, month)
}

function mkcalendar(tYear, tMonth){
    $('#year > span').text(tYear);
    $('#month > span').text(tMonth);

    if (tYear % 400 == 0) {
        mDays[1] = 29;
    } else if (tYear % 100 == 0) {
        mDays[1] = 28;
    } else if (tYear % 4 == 0) {
        mDays[1] = 29;
    }

    // 달의 마지막일, 시작 요일, 몇 주인지
    let tMonthLday = mDays[tMonth - 1];
    let monthSday = new Date(tYear, tMonth - 1, 1);
    let tMonthSday = monthSday.getDay();
    let tWeekCount = Math.ceil((tMonthSday + tMonthLday) / 7);
    let cPos = 0;
    let cDay = 0;
    let cForm = '';

    for (let i = 0; i < tWeekCount; i++) {
        cForm += '<div class="week">';
        for (let j = 0; j < 7; j++) {
            cForm += '<div class="day">'
            if(tMonthSday <= cPos && cDay < tMonthLday) {
                cDay++;
                if (cYear == tYear && cMonth == tMonth && cToday == cDay) {
                    cForm += '<span class="today">' + cDay + '</span>';
                } else {
                    cForm += '<span>' + cDay + '</span>';
                }
            }
            cForm += '</div>';
            cPos++;
        }
        cForm += '</div>'
    }

    $('#calendar').html(cForm);
}