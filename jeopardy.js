  async function fetchGameData() {
      try {
          // Fetch 100 categories
          const catRes = await axios.get('https://rithm-jeopardy.herokuapp.com/api/categories?count=100');
          const categories = catRes.data;
         
          
          const selectedCats = categories.filter(cat => {
              if (cat.id === 11 || cat.id === 15 || cat.id === 9 || cat.id === 10) {
                  return false; // Skip if category title is undefined
              }
              return true;
          }).sort(() => Math.random() - 0.5).slice(0, 6);

          const gameData = [];
          for (let cat of selectedCats) {
              // Fetch clues for each category
              const clueRes = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?id=${cat.id}`);
             // console.log(clueRes.data.clues.map(clue => clue.value));
              const clues = clueRes.data.clues
                   // Ensure clue has a value
                   .sort((a, b) => a.value - b.value) // Sort by value
                  .slice(0, 5); // Take first 5 clues
              gameData.push({ id: cat.id, title: cat.title, clues });
            }
          return gameData;
      } catch (error) {
          console.error('Error fetching data:', error);
          return [];
      }
  }



   function createGameBoard(gameData) {
      const table = document.getElementById('jeopardy-board');
      table.innerHTML = '';
      // Create header row with category titles
      const headerRow = document.createElement('tr');
      gameData.forEach(cat => {
          const th = document.createElement('th');
          th.textContent = cat.title.toUpperCase();
          headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      // Create 5 rows for point values
      for (let i = 0; i < 5; i++) {
          const row = document.createElement('tr');
          gameData.forEach((cat, catIndex) => {
              const td = document.createElement('td');
              const cluesss = cat.clues;
              //td.textContent = cluesss[i].value || '𐦉' || '♦';
               td.textContent = cluesss[i].value;
              td.dataset.catIndex = catIndex;
              td.dataset.clueIndex = i;
              td.addEventListener('click', handleCellClick);
              row.appendChild(td);
              //console.log(cat);
          });
          table.appendChild(row);
      }
  }


   let currentClue = null;
  let score = 0;
  const table = document.getElementById('jeopardy-board');

  function handleCellClick(e) {
      const td = e.target;
      if (td.classList.contains('answered')) return; // Ignore answered questions
      document.getElementById('start-btn').style.display = 'none';

      const catIndex = td.dataset.catIndex;
      const clueIndex = td.dataset.clueIndex;
      currentClue = gameData[catIndex].clues[clueIndex];

      // Show question
      const questionArea = document.getElementById('question-area');
       questionArea.style.display = 'block';
       table.style.display = 'none';
    
      document.getElementById('question').textContent = currentClue.question;
      document.getElementById('answer-input').value = '';

      // Mark cell as answered
      td.classList.add('answered');
      
  }

      

   document.getElementById('submit-answer').addEventListener('click', () => {
      const userAnswer = document.getElementById('answer-input').value.trim().toLowerCase();
      const correctAnswer = currentClue.answer.toLowerCase();
      
      if (userAnswer === correctAnswer) {
          score += currentClue.value;
          alert('Correct!');
      } else {
          score -= currentClue.value;
          alert(`Incorrect. The answer was: ${currentClue.answer}`);
      }

      document.getElementById('score').textContent = `Score: ${score}`;
      document.getElementById('question-area').style.display = 'none';
      currentClue = null;
      table.style.display = 'block';
      
      if ([...table.querySelectorAll('td.answered')].length === 30) {
          alert(`Game over!! Your final score is ${score}.`);
          table.innerHTML = '';
          if (gameData.length > 0 || gameData != null) {
              createGameBoard(gameData);
          }
      }
      document.getElementById('start-btn').style.display = 'block';
  });

  //  let isStartGameClicked = false;
   let gameData = [];

   
  document.getElementById('start-btn').addEventListener('click', async () => {
   document.getElementById('start-btn').textContent = 'Restart Game';
   document.getElementById('question-area').style.display = 'none';
   score = 0;
   document.getElementById('score').textContent = `Score: ${score}`;
   gameData = await fetchGameData();
    createGameBoard(gameData);
    // isStartGameClicked = true;
  });
