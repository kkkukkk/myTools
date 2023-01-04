const calReg = /[^\+\-\/\*\(\)0-9]/;
const calStrReg = /[+\-*/]/;

$(document).ready(() => {
    $("#cal").focus();
});

$("#resBtn").on("click", () => {
    let sik = $("#cal").val();
    if (!sik || sik.length < 3 || chkFour(sik) || calStrReg.test(sik.substring(sik.length - 1, sik.length))) return;

    let tmp = "<div>" + sik + " = " + calVal(sik) + "</div>";
    $(".res").prepend(tmp);
    $("#cal").val("");
});

$("#cal").on("input", (e) => {
    if (calReg.test(e.target.value)) e.target.value = e.target.value.slice(0, -1);
}).on("keyup", (e) => {
    if (e.keyCode == 13) $("#resBtn").trigger("click");
});

// 문자열로 입력받은 식을 배열로 변환, 계산하여 리턴
function calVal(param) {
    let arr = [...param];
    return calcul(ridWhatUpgrade(bond(arr)));
}

// 값이 숫자인지 확인
function isNum(param) {
    param += "";
    if (param == "" || isNaN(param)) return false;
    return true;
}

// 값에 사칙연산 기호가 포함 되어있는지 확인
function chkFour(str) {
    let res = true;
    if (str.includes("+") || str.includes("-") || str.includes("*") || str.includes("/")) res = false;
    return res;
}

//이어진 수 일 경우 붙이기 ex) 1,2,3,+,4,5 -> 123+45
function bond(param){
    let res = [];
    let tmp = '';
    param.forEach((item, index) => {
        if (isNum(item)){
            tmp += item;
            if (!isNum(param[index + 1])){
                res.push(tmp);
                tmp = '';
            }
        } else {
            res.push(item);
        }
    });
    return res;
}

// 계산하는 단계
function calcul(param){
    return pluMi(mulDi(param));
}

//더하기 빼기 계산 하여 값 리턴
function pluMi(param) {
    let num = 0;
    let cal = "";
    param.forEach((item) => {
        if (isNum(item) && cal == "") {
            num += parseFloat(item);
        } else if (isNum(item) && cal != "" && !chkFour(cal)) {
            switch (cal) {
                case "+":
                    num += parseFloat(item);
                    break;
                case "-":
                    num -= parseFloat(item);
                    break;
            }
        } else {
            cal = item;
        }
    });
    return num;
}

// 곱하기, 나누기 먼저 계산하여 입력받은 배열 가공
function mulDi(param) {
    let tmp;
    while(param.includes("*") || param.includes("/")){
        param.forEach((item, index) => {
            if (item == "*" || item == "/") {
                switch (item) {
                    case "*":
                        tmp = parseFloat(param[index - 1]) * parseFloat(param[index + 1]);
                        break;
                    case "/":
                        tmp = parseFloat(param[index - 1]) / parseFloat(param[index + 1]);
                        break;
                }
                param[index - 1] = tmp.toString();
                param.splice(index, 2);
            }
        });
    }
    return param;
}

//괄호 순서대로 계산
function ridWhatUpgrade(arr) {
    if (arr[0] == "(" && arr[arr.length - 1] == ")"){
        arr.pop();
        arr.shift();
    }

    while (arr.includes(")")) {
        let arrLen = arr.length;                                // 배열 길이
        let startIndex = arr.lastIndexOf("(");                  // 제일 안쪽 '('의 인덱스
        let bIndexLast = arr.indexOf(")", startIndex);          // startIndex 부터 다음으로 나오는 ')'의 인덱스
        let bIndexRealLast = arr.lastIndexOf(")");              // 제일 마지막 ')'의 인덱스
        let indexGap = bIndexLast == bIndexRealLast ? 0 : 2;    // 두개가 같으면 0, 다르면 2 (인덱스와 실제 갯수 차이)
        // 자를 개수
        // bIndexLast 와 bIndexRealLast가 같으면 - bIndexRealLast에 1을 더하고 시작 인덱스를 뺀 갯수만큼 자른다
        // bIndexLast 와 bIndexRealLast가 다르면 - 배열 길이에서 startIndex, bIndexRealLast, indexGap, 2를 빼주고, bIndexLast를 더해준다.
        let count = bIndexLast == bIndexRealLast ? bIndexRealLast + 1 - startIndex : arrLen - startIndex - bIndexRealLast - indexGap - 2 + bIndexLast;

        // 위에서 계산한 개수 만큼 배열을 자르고 자른 배열 자리(startIndex)에 n 을 넣어둔다.
        let tg = arr.splice(startIndex, count, "n");
        if (tg[0] == "(" && tg[tg.length - 1] == ")") {
            tg.pop();
            tg.shift();
        }
        // 잘라진 배열을 계산하여 n 자리에 넣는다
        arr[startIndex] = calcul(tg).toString();
    }

    return(arr);
}