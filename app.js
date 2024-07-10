import { cryptQuiz, decryptQuiz, displayQuiz } from "./quizProcess.js";
const quizStage = document.querySelector(".question");
const answerStage = document.querySelector(".answer");
const submitBtn = document.querySelector("button.submit");
function checkAnswer(userInput, trueAnswer) {
  let isValid = true;
  let inputIndex = 0;
  for (let num in trueAnswer) {
    if (num.toString() != userInput[inputIndex]) isValid = false;

    inputIndex++;
  }
  return isValid;
}

function playGame() {
  const { cryptedQuiz, chars } = cryptQuiz();
  for (const key in chars) {
    const answerHTML = document.createElement("div");
    answerHTML.innerText = `${chars[key]}: `;
    const inputHTML = document.createElement("input");
    inputHTML.setAttribute("type", "number");
    inputHTML.setAttribute("class", "inputNum");
    answerHTML.appendChild(inputHTML);
    answerStage.appendChild(answerHTML);
  }

  const arrInput = Array.from(answerStage.children);
  arrInput.forEach((e, i, arr) => {
    e.children[0].addEventListener("input", (event) => {
      if (i <= arr.length - 2 && event.target.value.length == 1) {
        event.target.blur();
        arr[i + 1].children[0].focus();
        console.log(event.target.value);
      }
    });
  });
  submitBtn.addEventListener("click", () => {
    let userInput = arrInput.map((e) => e.children[0].value);
    if (!userInput.includes("")) {
      let textNumQuestion = Array.from(quizStage.querySelectorAll("h2 span"));
      console.log(textNumQuestion);
      let decryptedQuiz = decryptQuiz(cryptedQuiz, chars, userInput);
      let isTrue =
        checkAnswer(userInput, chars) ||
        decryptedQuiz[0] + decryptedQuiz[1] == decryptedQuiz[2];
      if (isTrue) {
        displayQuiz(decryptedQuiz);
        textNumQuestion.forEach((e) => (e.style.color = "blue"));
      } else {
        textNumQuestion.forEach((e) => (e.style.color = "red"));
      }
    }
  });
}

playGame();
