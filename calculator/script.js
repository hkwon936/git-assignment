// 모든 버튼 요소와 display 요소를 선택합니다.
const buttons = document.querySelectorAll('.button'); //class="button"인 모든 요소를 선택해서 배열처럼 반환
const display = document.getElementById('display'); //HTML에서 id="display"인 요소 선택

// firstOperand, operator 변수 선언하고 null로 초기화합니다.
let firstOperand = null; // 연산자 누르기 전의 숫자
let operator = null; // 눌린 연산자 기호
let waitingForSecondOperand = false; //연산자 클릭 후 두번째 숫자 클릭을 기다리는 상태인지 확인할 때 사용할 변수, false=연산자 클릭 전으로 숫자 입력 기다리지 않는 상태, true=연산자 클릭 했으므로 숫자 입력 기다리는 상태
let wasCalculated = false; //계산을 완료했는지('=' 버튼을 눌렀는지) 확인할 때 사용할 변수, false는 = 누르기 전, true는 = 누른 후

//계산 함수(calculate 함수는 매개변수로 firstOperand, operator, secondOperand를 전달받아 operator에 따라 연산을 수행하고, 연산 수행된 값을 반환합니다.)
function calculate(aStr, op, bStr){ //calculate 함수 정의, display.textContent에 보이는 문자열(string)을 가져온 상태!
    const a = parseFloat(aStr); //parseFloat(): 문자열을 숫자(실수)로 바꿔주는 내장 함수, 문자열 aStr값을 실수로 변환해서 상수 a에 저장
    const b = parseFloat(bStr); //문자열 bStr 값을 실수로 변환해서 b에 저장

    let r; //계산 결과를 담을 변수 선언

    switch(op){
        case '+': r = a + b;
        break;
        case '-': r = a - b;
        break;
        case '*': r = a * b;
        break;
        case '/':
            if(b === 0) //나누는 숫자가 0이라면
                return 'NaN'; // 계산불가로 NaN 값 반환
            r = a / b; //그 외엔 a / b 값을 r에 저장하고
            break; //switch문 빠져나옴
        //default 코드를 생략한 이유: 만들어둔 버튼을 클릭함으로써만 값을 입력받을 것이기 때문에 굳이 필요없다고 생각했다.
    }
    return String(r); // switch문 다 돌면 결과 출력하는 코드
}

// 각 버튼에 클릭 이벤트 리스너를 추가합니다.
buttons.forEach((button) => { //forEach 선택된 버튼들을 하나씩 순회
    button.addEventListener('click', () => { //클릭할 때마다 실행할 함수 등록
        console.log(button.textContent); //버튼 안의 글자를 읽어와서 콘솔에 출력. 여기서 trim()은 필수는 아니지만 공백 제거를 위해 사용, HTML 코드가 깔끔할땐 티나지 않지만 코드를 안전하게 하기 위해 쓰임
        const value = button.textContent.trim(); //button 요소 안의 텍스트 내용을 가져오면서 공백이나 줄바꿈을 제거하는 상수 value 선언

        if(value === '.'){ // 소수점 입력시
            if(display.textContent === '0'){ //display에 0이 입력되어 있다면
                display.textContent = '0.'; // 0. 을 display에 표시해라
                return; // 0. 표시하고 함수 종료! 조건에 부합하면 밑에 있는 다른 로직은 실행하지 않기 위해 사용!
            }

            if(display.textContent.includes('.')){ // display에 .이 입력되어 있다면
                return; // 아무것도 하지 않고 함수 종료, 소수점이 누를때마다 추가되는 현상을 막음
            }
            display.textContent += '.'; // 위의 두 조건이 아닐때, 즉 숫자가 여러개 있고 아직 소수점이 없는 경우 숫자 뒤에 .을 추가하라
            return; // 숫자 뒤에 . 표시하고 함수 종료!
        }

        if (button.classList.contains('number')){ // html에서 class name=number인 버튼들이 입력됐을때
            if(waitingForSecondOperand || wasCalculated){ // === true 생략, //연산자 버튼이 방금 눌렸다면 or 계산 직후라면(=버튼이 눌렸다면)
                display.textContent = value; // 그 다음 숫자는 새로 덮어써라, 이어 쓰기 NO!! 새로운 숫자로 바꾼 후 display에 출력
                waitingForSecondOperand = false; //두 번째 숫자를 입력받았기에 더 이상 입력을 기다리는 상태가 아니므로 다시 false로 바꿔라
                wasCalculated = false; //= 입력 받았기에 다시 변수 초기화
            }else if(display.textContent === '0'){ // 현재 display에 아무것도 입력받지 않은 0 상태라면
                display.textContent = value; // 클릭한 숫자로 바꿔라! 원래 있던 0 뒤에 이어 붙이는게 아니라 입력받은 숫자만 표시하라!
            }else{ //현재 display에 0이 입력된 상태가 아니라면
                display.textContent += value; // 새로 클릭한 숫자를 뒤에 이어 붙여서 출력해라.
            }
        }

        if(button.classList.contains('function')){ // html에서 class name=function인 버튼이 입력됐는지 확인
            if(value === 'C'){ // 그 중에서도 C 버튼이 입력됐다면
                display.textContent = '0'; // 현재 display에 0을 표시하라
                firstOperand = null; // 연산자 누르기 전 숫자는 null 값으로 초기화
                operator = null; // 입력받은 연산자도 null 값으로 초기화
                waitingForSecondOperand = false; //연산자가 입력되기 전으로 초기화 됐으니까 당연히 입력 기다리는 상태 아님
                wasCalculated = false; //입력을 다 받지 못했으니 계산된 상태도 아님
            }
        }
        if(button.classList.contains('operator')){ //html에서 class name=operator인 버튼이 입력됐는지 확인
            if(value === '='){ // = 버튼이 클릭됐다면
                if(firstOperand !== null && operator !== null){ //첫 입력 값과 입력된 연산자가 있으면
                    const secondOperand = display.textContent; // 현재 화면에 출력된 숫자를 secondOperand 값으로 저장
                    const result = calculate(firstOperand, operator, secondOperand); // display.textContent = secondOperand 역할을 함. 상수 result에 calculate된 값을 저장하라.
                    display.textContent = result; //계산 결과를 display에 표시해라
                    firstOperand = result; //계산된 결과 값을 다음 계산의 첫 숫자로 저장
                    operator = value; // 새로 누른 연산자를 저장!

                    if(result !== 'NaN'){ // result가 NaN이 아니라면 즉, 정상적으로 계산됐다면
                        firstOperand = result; // 결과 값을 firstOperand로 다시 저장해라 -> 연속 계산 가능
                    }else{ // 그 외에는 다시 초기화해라.
                        firstOperand = null; //연산자 누르기 전의 숫자 값 null로 초기화
                        operator = null; // 눌린 연산자 값도 null로 초기화
                    }
                    wasCalculated = true; // =을 눌러 계산이 끝난 직후임을 기록! 이 다음에 숫자를 누르면 display가 초기화되고 연산할 두번째 숫자 입력을 시작할 수 있게 됨
                    waitingForSecondOperand = false; //연산자 클릭 후 두 번째 숫자를 기다리는 상태로 새로운 숫자 입력받을 준비가 됐음을 뜻함
                }
                return; // 함수 한 번 돌고 실행 종료
            }
            if(firstOperand === null){ // 만약 연산자 누르기 전에 아무 숫자도 눌리지 않았다면
                firstOperand = display.textContent; //현재 display에 표시된 숫자를 변수 firstOperand에저장한다
            }else if(!waitingForSecondOperand && operator !== null && !wasCalculated){ //새로운 숫자를 입력했고, operator도 클릭했고, = 버튼으로 계산도 끝났을 경우
                const result = calculate(firstOperand, operator, display.textContent); //이전 계산 결과와 지금 입력한 숫자의 계산 값을 result 변수에 저장
                display.textContent = result; //result를 display에 출력
                firstOperand = result; //지금 계산된 값을 새로운 계산을 할 때 이전 계산값으로 저장
            }
            operator = value; //사용자가 누른 연산자 버튼의 기호를 변수 operator에 저장한다
            waitingForSecondOperand = true; //연산자 버튼을 클릭 받아 변수에 저장했으니까 다음 숫자 입력을기다리는 상태가 되므로 true
            wasCalculated = false;
            console.log('firstOperand:', firstOperand);
            console.log('operator:', operator);
        }
    })
})