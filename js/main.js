let startBtn = document.querySelector(".start-btn")
let theInput = document.querySelector(".name-input")
let theInputFiled = document.querySelector(".name-input .the-name-of-player");
let thePlayerName = document.querySelector(".header .name span");
let questionsCount = document.querySelector(".header .count span");
let theQuestion = document.querySelector(".quiz-box .the-question");
let theAnswers = document.querySelector(".quiz-box .the-answers");
let theBtn = document.querySelector(".quiz-box .submit-btn");
let theProgDots = document.querySelector(".footer .the-prog-dots");
let theTimer = document.querySelector(".footer .timer");
let historyList = document.querySelector(".offcanvas-body .players")

let theRightAnswers = 0;
let theWrongAnswers = 0;
let theCurrentQuestion = 0;
let numberOfQuestion = 10;

// send e-mail
document.getElementById("my-form").addEventListener("submit",function(event) {
  event.preventDefault(); // منع السلوك الافتراضي للإرسال
  sentEmail()
// clone to next funtions
  if (theInputFiled.value !== "") {
    thePlayerName.innerHTML = theInputFiled.value
    theInput.remove()


  } else {
    // if the input filed empty make it's color red
    theInputFiled.classList.add("req")
  }
});

// // set the name of the player
// i commuted it because it make interfirns with submit event
// startBtn.addEventListener("click", ()=> {
//   if (theInputFiled.value !== "") {
//     thePlayerName.innerHTML = theInputFiled.value
//     theInput.remove()


//   } else {
//     // if the input filed empty make it's color red
//     theInputFiled.classList.add("req")
//   }
// })
 

makeHistory()

questionsCount.innerHTML = numberOfQuestion;


fetch("questions_islam.json") // URL of the API
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json(); // Parse the JSON response
  })
  .then((data) => {
    // console.log(data); // Handle the data from the API
    // console.log(data.questions[0].question);  // test using obj
    // console.log(data.questions.length);  // test using obj

    // select random 10 questions
    let emptyArr = new Array(data.questions.length).fill(""); // make arr of ""
    let randomArrForQuestion = emptyArr.map((e) => Math.floor(Math.random() * data.questions.length) ); // make the values random
    randomArrForQuestion.length = numberOfQuestion; // select only the first 10 number
    // console.log(randomArrForQuestion)

    // make questions dots
    for (i = 0; i < randomArrForQuestion.length; i++) {
      let span = document.createElement("span");
      theProgDots.appendChild(span);
    }
    let theDotsList = document.querySelectorAll(".the-prog-dots span")

    showQuestion();

    changeTheStatus()

    // add clicking functionality to Answers
    addEventListener("click", (a) => {
      if (a.target.classList.contains("answer")) {
        let theAnswersList = document.querySelectorAll(".the-answers .answer");
        theAnswersList.forEach((e) => {
            e.classList.remove("empty-alert");
        });
        theAnswersList.forEach((e) => e.classList.remove("selected"));
        a.target.classList.add("selected");
      }
    });

    // clicking submit btn
    theBtn.addEventListener("click", function () {
      let theSelectedAnswer = document.querySelector(".the-answers .answer.selected .AnswerDiv");
      let theCorrectAnswerIndex = data.questions[randomArrForQuestion[theCurrentQuestion]].correct
      let theAnswer = data.questions[randomArrForQuestion[theCurrentQuestion]].answers[theCorrectAnswerIndex]
      if (theSelectedAnswer) {
        if (theAnswer === theSelectedAnswer.innerHTML) {
          theCurrentQuestion++
          theRightAnswers++
          showQuestion()
        } else {
          theCurrentQuestion++
          theWrongAnswers++
          showQuestion()
        }
        changeTheStatus()
      } else {
        // alert using bootstrap
        let theAnswersList = document.querySelectorAll(".the-answers .answer");
        theAnswersList.forEach((e) => {
            e.classList.add("empty-alert");
        });
      }
    });

    // functions area
    function showQuestion() {
      if (theCurrentQuestion < numberOfQuestion) {
        let question = data.questions[randomArrForQuestion[theCurrentQuestion]].question;
        theQuestion.innerHTML = ""
        theQuestion.appendChild(document.createTextNode(question));

        theAnswers.innerHTML = ""
        let numberOFAnswers = data.questions[theCurrentQuestion].answers.length;
        

        // make arr of random values to used it make answer random  
        let randomArrForAnswers = Array(numberOFAnswers).fill("")
        randomArrForAnswers = randomArrForAnswers.map((e , i) =>  e = i)
        // console.log(randomArrForAnswers)
        for (let i = randomArrForAnswers.length - 1; i >= 0; i--) {
          let theBox = randomArrForAnswers[i]
          let randomValue = Math.floor(Math.random() * i)
          randomArrForAnswers[i] = randomArrForAnswers[randomValue]
          randomArrForAnswers[randomValue] = theBox
          // randomArrForAnswers[i]
        }

        // and the answers to the dom randomly
        for (let i = 0; i < numberOFAnswers; i++) {
          let answer = data.questions[randomArrForQuestion[theCurrentQuestion]].answers[randomArrForAnswers[i]];
          let div = document.createElement("div");
          div.classList.add("answer");
          div.classList.add(`${i}`);
          let span = document.createElement("span");
          div.appendChild(span);
          let AnswerDiv = document.createElement("div")
          AnswerDiv.classList.add("AnswerDiv")
          AnswerDiv.appendChild(document.createTextNode(answer))
          div.appendChild(AnswerDiv);
          theAnswers.appendChild(div);
        }
      } else {
        endGame()
      }
    }
    function changeTheStatus() {
      if (theCurrentQuestion < numberOfQuestion) {
        // change number inside counter
        questionsCount.innerHTML = questionsCount.innerHTML - 1
        // console.log(theCurrentQuestion)
        // change number of blue bots
        for (let i = 0; i <= theCurrentQuestion; i++) {
          theDotsList[i].classList.add("done")
        }
      }
    }
    function endGame() {
      theBtn.classList.add("disable")
      // add to locale storage 
      let playerName = thePlayerName.innerHTML
      console.log(theRightAnswers)
      let playersData = {
        players: [{name: `${playerName}`, score: `${theRightAnswers}`}]
      }
      if (window.localStorage.getItem("players")) {
        let buffer = JSON.parse(localStorage.getItem("players"))
        if (buffer) {
          buffer.players.push({name: playerName, score: `${theRightAnswers}`}) 
          window.localStorage.setItem("players", JSON.stringify(buffer))
        }
      } else {
        window.localStorage.setItem("players", JSON.stringify(playersData))
      }

      // show the result popup using bootstrap module 
      let result = `your result is ${theRightAnswers}/${numberOfQuestion}!`;
      document.getElementById("gameResult").textContent = result;
      let resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
      resultModal.show();


      makeHistory()
      makeReplaybtn()
    }
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });


// append the players data to side bar
function makeHistory() {
  let playerData = JSON.parse(localStorage.getItem("players"))
  // console.log(playerData)
  if (playerData) {
    let numberOfPlayer = playerData.players.length;
    for (let i = 0; i < numberOfPlayer; i++) {
      let div = document.createElement("div")
      div.classList.add("player")
      let nameSpan = document.createElement("span")
      nameSpan.appendChild(document.createTextNode(`${playerData.players[i].name}`))
      div.appendChild(nameSpan)
      div.appendChild(document.createTextNode(":"))
      let nameScore = document.createElement("span")
      nameScore.appendChild(document.createTextNode(`${playerData.players[i].score}`))
      div.appendChild(nameScore)
      historyList.appendChild(div)
    }
  }
}

// sent email function using Emailjs serves
function sentEmail() {
  let players = {
    name : document.querySelector(".the-name-of-player").value
  }
  emailjs.send("service_3ne7ner", "template_b1cibkm", players)
  console.log("maasses")
}