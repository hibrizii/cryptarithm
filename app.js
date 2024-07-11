import { cryptQuiz, decryptQuiz, displayQuiz } from "./quizProcess.js";
const mainStage = document.querySelector("main");
const quizStage = document.querySelector(".question");
const answerStage = document.querySelector(".answer");
const submitBtn = document.querySelector("button.submit");
const reloadBtn = document.querySelector(".reload");
const vbFeatureBtn = document.querySelector(".visible-feature");
let arrInput = Array.from(answerStage.children);
let isVFAllowed = false;
arrInput.forEach((e, i, arr) => {
  e.children[1].addEventListener("input", (event) => {
    if (i < arr.length - 1 && event.target.value.length == 1) {
      event.target.blur();
      arr[i + 1].children[1].focus();
    }
  });
});

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
  submitBtn.innerText = "SUBMIT";
  mainStage.style.backgroundColor = "#3f2af752";
  isVFAllowed = false;
  vbFeatureBtn.innerHTML = "<i class='fa-solid fa-eye-slash char'></i>";
  const { cryptedQuiz, chars } = cryptQuiz();
  displayQuiz(cryptedQuiz);
  let textNumQuestion = Array.from(quizStage.querySelectorAll("h2 span"));
  arrInput.forEach((e) => {
    console.log(e.children[1].oninput);
    e.children[1].oninput = null;
    e.children[1].value = "";
  });
  let index = 0;
  for (const key in chars) {
    arrInput[index].children[0].innerText = `${chars[key]}:`;
    index++;
  }

  function vbFeature() {
    let tempValue = arrInput.map((e) => e.children[1].value);
    let decryptedQuiz = decryptQuiz(cryptedQuiz, chars, tempValue);
    displayQuiz(decryptedQuiz);
  }

  vbFeatureBtn.onclick = () => {
    isVFAllowed = !isVFAllowed;
    if (isVFAllowed) {
      vbFeatureBtn.innerHTML = "<i class='fa-regular fa-eye'></i>";
      vbFeature();
      arrInput.forEach((e) => {
        e.children[1].oninput = vbFeature;
      });
    } else {
      vbFeatureBtn.innerHTML = "<i class='fa-solid fa-eye-slash char'></i>";
      displayQuiz(cryptedQuiz);
      arrInput.forEach((e) => {
        e.children[1].oninput = null;
      });
    }
  };

  function submit() {
    let userInput = arrInput.map((e) => e.children[1].value);
    if (!userInput.includes("")) {
      let decryptedQuiz = decryptQuiz(cryptedQuiz, chars, userInput);
      textNumQuestion = Array.from(quizStage.querySelectorAll("h2 span"));
      let alternateAnswer =
        parseInt(decryptedQuiz[0]) + parseInt(decryptedQuiz[1]) ==
        parseInt(decryptedQuiz[2]);
      let isTrue = checkAnswer(userInput, chars) || alternateAnswer;
      if (isTrue) {
        submitBtn.innerText = "Main Lagi";
        submitBtn.onclick = playGame;
        mainStage.style.backgroundColor = "#0080008a";
        displayQuiz(decryptedQuiz);
      } else {
        textNumQuestion.forEach((e) => (e.style.color = "red"));
      }
    }
  }
  submitBtn.onclick = submit;
}

reloadBtn.onclick = playGame;
document.querySelector(".starto-btn").onclick = (event) => {
  mainStage.classList.toggle("not-start-yet");
  playGame();
  event.target.classList.add("not-start-yet");
};
