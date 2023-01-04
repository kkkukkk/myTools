const timeUnitArray = ['초','분','시','일','주','달','년'];

$(() => {
    let now = moment().format('YYYY/MM/DD');
    $("#startDay").val(now);
    
    setInterval(()=>{
        let ma;
        let time = moment(moment(),'HH:mm:ss');
        let lastTime = moment('17:00:00', 'HH:mm:ss');
        let diff = moment.duration(lastTime.diff(time))
        let result = diff.hours() + '시간 ' + diff.minutes() + '분 ' + diff.seconds() + '초';

        if (time.hours() > 11) {ma = '오후'} else {ma = '오전'}

        $('#now').val(ma + ' ' + time.format('hh:mm:ss'));
        $('#lastTime').val(result);
    }, 1000)
})

$("#selectBtn").on("click", () => {
    if($(".calInputs").hasClass("active")){ shList(0); } else { shList(1); }
});

$("#unitSelect").children().click((e) => {
    $("#selectBtn").text($(e.target).text());
    shList(0);
})

$(".btns button").on("click", (e) => {
    let bf = parseInt($("#pnDay").val());
    let Mday = parseInt($(e.target).val());
    setValue(bf+Mday);
});

$(".reset > button").on("click", () => {
    setValue(0);
    $("#resDay").val("")
});

$(".fin > button").on("click", (e) => {
    if ($("#pnDay").val() == "0") {
        $("#resDay").val("일 입력!");
        return;
    }
    result(e.target.value);
});

$("#calButton").on("click", ()=> {
    let targetText = $("#selectBtn").text();
    let calTarget = parseInt($("#calTarget").val());
    if($("#selectBtn").text() == "선택") return;
    if(!numberCheck(calTarget)) return;

    let unit = timeUnit(unitSet(targetText));
    let timeArray = getTimeArray(calTarget * unit);

    timeArray.forEach((item,index) => {
        $(".calResult").children().eq(index).text(item);
    })
});

function numberCheck(param) {
    if (isNaN(param)) {
        alert('숫자를 입력하세요!');
        return false;
    } else if (param == "") {
        return false;
    }
    return true;
}

function getTimeArray(param) {
    let timeArray = [];
    for (let i = 0; i < 7; i++) timeArray.push(parseFloat(parseFloat(calTime(param, i)).toFixed(4)) + " " + timeUnitArray[i]); //소수점 이하 4자리까지 처리후 필요없는 0을 처리하기 위해 다시 parseFloat
    return timeArray;
}

function shList(flag) {
    if (flag == 1) {
        $(".calInputs").addClass("active");
        $("#unitSelect").css("max-height", "200px").css("outline", "1px solid rgba(0,0,0,.3)");
    } else {
        $(".calInputs").removeClass("active");
        $("#unitSelect").css("max-height", "0px").css("outline", "0 none");
    }
}

function setValue(param) {
    $("#pnDay").val(param);
}

function result(param) {
    if (param == 1) {
        $("#resDay").val(
            moment($("#startDay").val(), "YYYY/MM/DD").add($("#pnDay").val(), "days").format("YYYY/MM/DD")
        );
    } else {
        $("#resDay").val(
            moment($("#startDay").val(), "YYYY/MM/DD").add($("#pnDay").val(), "days").add(-1, "days").format("YYYY/MM/DD")
        );
    }
}

function calTime(param, order) {
    const time = {
        0 : param,
        1 : param / 60,
        2 : param / 3600,
        3 : param / 86400,
        4 : param / 604800,
        5 : param / 2628000,
        6 : param / 31540000
    };
    return time[order];
}

function timeUnit(param) {
    const time = {
        'second' : 1,
        'minute' : 60,
        'hour' : 3600,
        'day' : 86400,
        'week' : 604800,
        'month' : 2628000,
        'year' : 31540000,
    };
    return time[param];
}

function unitSet(param) {
    const unit = {
        '초' : 'second',
        '분' : 'minute',
        '시' : 'hour',
        '일' : 'day',
        '주' : 'week',
        '달' : 'month',
        '년' : 'year',
    }
    return unit[param];
}