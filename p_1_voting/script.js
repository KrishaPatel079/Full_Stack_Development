// script.js

const votes = {
  'JavaScript': 0,
  'Python': 0,
  'Java': 0,
  'C++': 0,
  'C': 0
};

// Called when a user clicks a vote button
function vote(language) {
  votes[language]++;
  updateVotes();
}

// Updates the vote count display
function updateVotes() {
  for (let lang in votes) {
    document.getElementById(lang).textContent = votes[lang];
  }
}

// Simulate real-time random votes every 2 seconds
setInterval(() => {
  const languages = Object.keys(votes);
  const randomLang = languages[Math.floor(Math.random() * languages.length)];
  votes[randomLang]++;
  updateVotes();
}, 2000);

// Initial update
updateVotes();
