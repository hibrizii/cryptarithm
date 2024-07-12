const quizStage = document.querySelector(".question");

function generateNum(variety) {
  const num1 = Math.floor(Math.random() * (8500 - 500 + 1)) + 500;
  const num2 = Math.floor(Math.random() * (1500 - 100 + 1)) + 100;
  const arith = variety == "sum" ? num1 + num2 : num1 - num2;
  return [num1, num2, arith];
}

function generateNumQuiz(vr) {
  let isFor = false;
  let result;
  while (!isFor) {
    let arrNums = generateNum(vr);
    let set = new Set(arrNums.join("").split(""));
    let is3Num = arrNums.map((e) => new Set(e.toString()).size >= 3);
    let isNoDouble0 = arrNums.map(
      (num) => (num.toString().match(/0/g) || []).length <= 1
    );
    let isOke = arrNums[0] != arrNums[1] && set.size == 3;
    if (isOke && (is3Num[0] || is3Num[1]) && isNoDouble0[0] && isNoDouble0[1]) {
      result = { arrNums, set };
      isFor = true;
    }
  }
  return result;
}

function cryptQuiz({ arrNums, set }) {
  let chars = {};
  let arrSet = Array.from(set);
  let prevChar = [];
  for (let i = 0; i < arrSet.length; i++) {
    let randomChar = Math.floor(Math.random() * (76 - 65 + i)) + 65 + i;
    randomChar = prevChar.includes(randomChar) ? randomChar + 1 : randomChar;
    chars[`${arrSet[i]}`] = String.fromCharCode(randomChar);
    prevChar.push(randomChar);
  }
  let cryptedQuiz = arrNums.map((num) =>
    num
      .toString()
      .split("")
      .map((n) => chars[n])
      .join("")
  );
  return { cryptedQuiz, chars };
}

function decryptQuiz(cryptedQuiz, chars, userInput) {
  let keyObj = {};
  let indexInput = 0;
  for (const key in chars) {
    keyObj[`${chars[key]}`] =
      userInput[indexInput] != "" ? userInput[indexInput] : chars[key];
    indexInput++;
  }
  let decryptedQuiz = cryptedQuiz.map((num) =>
    num
      .toString()
      .split("")
      .map((n) => keyObj[n])
      .join("")
  );
  return decryptedQuiz;
}

function displayQuiz(quizDisplayed, tipe) {
  let regex = /[0-9]/;
  let quiz = quizDisplayed.map((num) =>
    num
      .split("")
      .map((c) => `<span class=${regex.test(c) ? "num" : "char"}>${c}</span>`)
      .join("")
  );
  let quizLength = quizDisplayed.map((e) =>
    e.length == 4
      ? "for"
      : e.length == 3
      ? "three"
      : e.length == 2
      ? "two"
      : "one"
  );
  let htmlQuiz = `
    <div class="quiz-line ${tipe}">
     <h2 class="${quizLength[0]}">${quiz[0]}</h2>
     <h2 class="${quizLength[1]}">${quiz[1]}</h2>
    </div>
     <h2 class="${quizLength[2]} arithResult">${quiz[2]}</h2>
     `;
  quizStage.innerHTML = htmlQuiz;
}

export { cryptQuiz, decryptQuiz, displayQuiz, generateNumQuiz };
