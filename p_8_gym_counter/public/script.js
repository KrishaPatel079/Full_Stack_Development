const counterEl = document.getElementById('counter');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const resetBtn = document.getElementById('reset');

let count = parseInt(localStorage.getItem('gymCounter')) || 0;
counterEl.textContent = count;

function updateCounter() {
  counterEl.textContent = count;
  localStorage.setItem('gymCounter', count);
}

increaseBtn.addEventListener('click', () => {
  count++;
  updateCounter();
});

decreaseBtn.addEventListener('click', () => {
  if (count > 0) count--;
  updateCounter();
});

resetBtn.addEventListener('click', () => {
  count = 0;
  updateCounter();
});
