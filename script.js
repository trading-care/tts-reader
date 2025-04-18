let sentences = [];
let currentIndex = 0;
let isReading = false;
let voices = [];

function fetchDataAndInit() {
  fetch("https://script.google.com/macros/s/AKfycbz-RacKstruMOWWIkYXNHzX7-ay5Dc4eYxWvRD6D5esvZwxt_jcj7SLCPOdVwAKzqWBNA/exec")
    .then((res) => res.json())
    .then((data) => {
      if (data.text) {
        sentences = data.text.split('.').map(s => s.trim()).filter(s => s.length > 0);
        renderSentences();
      }
    });
}

function renderSentences() {
  const container = document.getElementById("textDisplay");
  container.innerHTML = "";
  sentences.forEach((sentence, index) => {
    const div = document.createElement("div");
    div.className = "sentence";
    div.id = `sentence-${index}`;
    div.textContent = sentence + ".";
    container.appendChild(div);
  });
}

function highlight(index) {
  document.querySelectorAll('.sentence').forEach((el, i) => {
    el.classList.toggle('highlight', i === index);
  });
}

function speakText(text, callback) {
  if (!text) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'vi-VN';
  utter.voice = voices.find(v => v.lang === 'vi-VN') || null;

  utter.onend = () => {
    callback();
  };

  speechSynthesis.cancel(); // iOS hack
  speechSynthesis.speak(utter);
}

function startReading() {
  if (!sentences.length) return;

  isReading = true;
  currentIndex = 0;
  readNext();
}

function readNext() {
  if (!isReading || currentIndex >= sentences.length) {
    highlight(-1);
    return;
  }

  const text = sentences[currentIndex];
  highlight(currentIndex);

  speakText(text, () => {
    currentIndex++;
    readNext();
  });
}

function pauseReading() {
  speechSynthesis.pause();
}

function resumeReading() {
  speechSynthesis.resume();
}

document.getElementById("startButton").addEventListener("click", () => {
  if (speechSynthesis.speaking || speechSynthesis.paused) {
    speechSynthesis.cancel(); // Stop current
  }
  startReading();
});

document.getElementById("pauseButton").addEventListener("click", pauseReading);
document.getElementById("resumeButton").addEventListener("click", resumeReading);

window.speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();
};

fetchDataAndInit();
