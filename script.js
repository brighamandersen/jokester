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
    Accept: "application/json"
  }
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
  await fetchJoke();
  jokeText.innerText = currentJoke.msg;
  // jokeText.innerText = await fetchJoke();
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
    currentJoke.id = resData.id.toString();
    currentJoke.msg = resData.setup + "\n" + resData.punchline;
    // console.log("currentJoke", currentJoke);
    return;
    // console.log(resData);
    // // currentJoke = resData;
    // return resData.setup + "\n" + resData.punchline;
  }
  const response = await fetch("https://icanhazdadjoke.com/", REQ_HEADERS);
  const resData = await response.json();
  // console.log(resData);

  currentJoke.id = resData.id;
  currentJoke.msg = resData.joke;
  // console.log("currentJoke", currentJoke);
  return;
  // return resData.joke;
}

function saveJoke() {
  const alreadyExists = jokeArr.indexOf(currentJoke.id) > -1;
  if (alreadyExists) {
    alert("You already saved that joke");
    return;
  }
  console.log("jokeArr1", jokeArr);
  jokeArr.push(currentJoke);
  console.log("jokeArr2", jokeArr);
  const deleteBtn =
    '<button class="delete m-1" onclick="deleteJoke()"></button>';
  const listItems = jokeArr
    .map((joke) => `<li key=${joke.id}>` + joke.msg + deleteBtn + "</li>")
    .join("");
  jokeList.innerHTML = listItems;
  closeModal();
  savedJokes.classList.remove("is-hidden");
}

function deleteJoke() {}
