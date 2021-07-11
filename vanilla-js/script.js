const jokeModal = document.querySelector("#joke-modal");
const jokeSubtitle = document.querySelector("#joke-subtitle");
const jokeText = document.querySelector("#joke-text");
const saveBtn = document.querySelector("#save-btn");
const savedJokes = document.querySelector("#saved-jokes");
const jokeList = document.querySelector("#joke-list");

let wantsCodingJoke = true; // false denotes dad joke
let currentJoke = {};
let jokeArr = [];

REQ_HEADERS = {
  headers: {
    Accept: "application/json",
  },
};

function openModal() {
  jokeModal.classList.add("is-active");
}

function closeModal() {
  jokeSubtitle.innerText = "";
  jokeText.innerText = "";
  jokeModal.classList.remove("is-active");
}

function changeJokeSubtitle() {
  if (wantsCodingJoke) {
    jokeSubtitle.innerText = "Coding Joke";
  } else {
    jokeSubtitle.innerText = "Dad Joke";
  }
}

async function seeNewJoke(preference) {
  if (preference != null) {
    wantsCodingJoke = preference;
    changeJokeSubtitle();
  }
  openModal();
  saveBtn.classList.add("is-loading");
  // await fetchJoke();
  jokeText.innerText = await fetchJoke();
  saveBtn.classList.remove("is-loading");
}

async function fetchJoke() {
  if (wantsCodingJoke) {
    const response = await fetch(
      "https://official-joke-api.appspot.com/jokes/programming/random",
      REQ_HEADERS
    );
    let resData = await response.json();
    resData = resData[0];
    console.log(resData);
    return resData.setup + "\n" + resData.punchline;
  }
  const response = await fetch("https://icanhazdadjoke.com/", REQ_HEADERS);
  const resData = await response.json();
  console.log(resData);
  return resData.joke;
}

function saveJoke() {
  const alreadyExists = jokeArr.indexOf(jokeText.innerText) > -1;
  if (alreadyExists) {
    alert("You already saved that joke");
    return;
  }
  console.log("jokeArr1", jokeArr);
  jokeArr.push(jokeText.innerText);
  console.log("jokeArr2", jokeArr);
  const listItems = jokeArr.map((joke) => "<li>" + joke + "</li>").join("");
  jokeList.innerHTML = listItems;
  closeModal();
  savedJokes.classList.remove("is-hidden");
}
