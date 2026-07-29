const tg = window.Telegram?.WebApp;
if (tg) tg.expand();

const gridElement = document.getElementById('grid');
const calledNumberElement = document.getElementById('calledNumber');

let userCard = [];
let calledNumbersHistory = [];

// 1. የቢንጎ 5x5 ካርድ ማዘጋጀት (B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75)
function generateCard() {
  const ranges = [
    [1, 15],   // B
    [16, 30],  // I
    [31, 45],  // N
    [46, 60],  // G
    [61, 75]   // O
  ];

  const columns = ranges.map(([min, max]) => {
    let nums = [];
    while (nums.length < 5) {
      let r = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!nums.includes(r)) nums.push(r);
    }
    return nums;
  });

  // Grid HTML መገንባት
  gridElement.innerHTML = '';
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      // መካከለኛው ቦታ (Row 2, Col 2) FREE ነው
      if (row === 2 && col === 2) {
        cell.innerText = 'FREE';
        cell.classList.add('free', 'marked');
      } else {
        const val = columns[col][row];
        cell.innerText = val;
        cell.onclick = () => toggleMark(cell);
      }
      gridElement.appendChild(cell);
    }
  }
}

// 2. ተጫዋቹ ቁጥሩን ሲነካው ቀለም ማቀየር (Mark/Unmark)
function toggleMark(cell) {
  cell.classList.toggle('marked');
}

// 3. ቁጥር በየ 4 ሰከንዱ መጥራት (Simulation)
function startCallingNumbers() {
  setInterval(() => {
    let randomNum = Math.floor(Math.random() * 75) + 1;
    if (!calledNumbersHistory.includes(randomNum)) {
      calledNumbersHistory.push(randomNum);
      calledNumberElement.innerText = randomNum;
    }
  }, 4000);
}

// 4. BINGO Button ሲነካ
function claimBingo() {
  alert('🎉 BINGO! ውጤትዎ እየተረጋገጠ ነው...');
}

// አፑ ሲነሳ ካርዱንና ጥሪውን አስጀምር
generateCard();
startCallingNumbers();