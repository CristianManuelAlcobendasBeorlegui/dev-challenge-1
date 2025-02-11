// === STRICT MODE === //
"use strict";

// === DOM ELEMENTS === //
let typewriter; 
const WORDS = [
  "<Web Developer>",
  "<System Administrator>",
  "<Front-end Developer>",
  "<Back-end Developer>"
];
const TYPING_SPEED_SECS = .1;

// === EVENT LISTENERS === //
window.addEventListener("load", init, false);

// === METHODS === //

function init() {
  // Link DOM elements
  typewriter = document.querySelector(".typewriter__text");

  // Execute methods
  startTyping();
}

async function startTyping() {
  for (let word of WORDS) {
    await writeWord(word);
    await sleep(2 * 1000);
    await cleanTypewriter();
    await sleep(1 * 1000);
  }

  startTyping();
}

async function writeWord(word) {
  for (let char of word) {
    typewriter.innerText += char;
    await sleep(TYPING_SPEED_SECS * 1000);
  }

  return new Promise(resolve => setTimeout(resolve, 0));
}

async function cleanTypewriter() {
  for (let i = typewriter.innerText.length; i >= 0; --i) {
    typewriter.innerText = typewriter.innerText.substr(0, i);
    await sleep(TYPING_SPEED_SECS * 1000);
  }

  return new Promise(resolve => setTimeout(resolve, 0));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}