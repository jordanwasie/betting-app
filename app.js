const tg = window.Telegram.WebApp;
tg.expand(); // Mini App ሙሉ ስክሪን እንዲሆን

// የተጠቃሚ ስም ማሳያ
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
  document.getElementById('user-name').innerText = `ተጫዋች: ${tg.initDataUnsafe.user.first_name}`;
}

// የቢንጎ ካርድ ቁጥሮችን መፍጠር (5x5 Grid)
const cardContainer = document.getElementById('bingo-card');

function generateBingoCard() {
  const numbers = new Set();
  while (numbers.size < 25) {
    numbers.add(Math.floor(Math.random() * 75) + 1);
  }

  const numArray = Array.from(numbers);

  numArray.forEach((num, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    
    // መሃል ላይ ያለውን ነፃ ቦታ (FREE) ማድረግ
    if (index === 12) {
      cell.innerText = 'FREE';
      cell.classList.add('selected');
    } else {
      cell.innerText = num;
      cell.addEventListener('click', () => {
        cell.classList.toggle('selected');
      });
    }

    cardContainer.appendChild(cell);
  });
}

function claimBingo() {
  tg.showAlert('🎉 BINGO! ጥያቄዎ ለሰርቨሩ ተልኳል!');
}

generateBingoCard();