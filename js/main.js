(function () {
  'use strict';

  var code = [], // Color sequence the player needs to guess
      guess = [], // Color sequence of player's guesses
      options = document.getElementsByClassName('option'),
      inputRows = document.getElementsByClassName('guess'),
      hintContainer = document.getElementsByClassName('hint'),
      secretSockets = document.getElementsByClassName('secret socket'),
      modalOverlay = document.getElementById('modalOverlay'),
      modalMessage = document.getElementById('modalMessage'),
      rowIncrement = 1,
      hintIncrement = 1,
      pegs = {
        1: 'green',
        2: 'purple',
        3: 'red',
        4: 'yellow',
        5: 'blue',
        6: 'brown'
      };

  function gameSetup () {
    generateSecretCode(1, 7);

    // Add event listener to every code option button
    for (var i = 0; i < options.length; i++)
      options[i].addEventListener('click', insertGuess, false);

    document.getElementById('newGame').onclick = newGame;
    document.getElementById('delete').onclick = deleteLast;
  }

  function insertGuess () {
    var self = this;
    var slots = inputRows[inputRows.length - rowIncrement].getElementsByClassName('socket');

    slots[guess.length].className = slots[guess.length].className + ' peg ' + self.id; // Insert node into page

    guess.push(+(self.value));

    if (guess.length === 4) {
      if (compare())
        gameState('won');
      else
        rowIncrement += 1;
    }

    if ( rowIncrement === inputRows.length + 1 && !compare() )
      gameState('lost');
  }
    
  function compare () {
    var isMatch = true;
    var codeCopy = code.slice(0);

    // First check if there are any pegs that are the right color in the right place
    for (var i = 0; i < code.length; i++) {
      if (guess[i] === code[i]) {
        insertPeg('hit');
        codeCopy[i] = 0;
        guess[i] = -1;
      } else
        isMatch = false;
    }

    // Then check if there are any pegs that are the right color but NOT in the right place
    for (var j = 0; j < code.length; j++) {
      if (codeCopy.indexOf(guess[j]) !== -1) {
        insertPeg('almost');
        codeCopy[codeCopy.indexOf(guess[j])] = 0;
      }
    }

    hintIncrement += 1; // Set the next row of hints as available
    guess = [];         // Reset guess sequence

    return isMatch;
  }

  function insertPeg (type) {
    var sockets = hintContainer[hintContainer.length - hintIncrement].getElementsByClassName('js-hint-socket');
    sockets[0].className = 'socket ' + type;
  }

  function deleteLast () {
    if (guess.length !== 0) {
      var slots = inputRows[inputRows.length - rowIncrement].getElementsByClassName('socket');
      slots[guess.length - 1].className = 'socket'; // Insert node into page
      guess.pop();
    }
  }

  function newGame () {
    guess = [];        // Reset guess array
    clearBoard();
    rowIncrement = 1;  // Set the first row of sockets as available for guesses
    hintIncrement = 1; // Set the first row of sockets as available for hints
    hideModal();
    gameSetup();           // Prepare the game
  }

  function hideModal () {
    modalOverlay.className = '';
  }

  function clearBoard () {
    // Clear the guess sockets
    for (var i = 0; i < inputRows.length; i++) {
      inputRows[i].innerHTML = '';
      for (var j = 0; j < 4; j++) {
        var socket = document.createElement('div');
        socket.className = 'socket';
        inputRows[i].appendChild(socket);
      }
    }

    // Clear the hint sockets
    for (var i = 0; i < hintContainer.length; i++) {
      var socketCollection = hintContainer[i].getElementsByClassName('socket');
      for (var j = 0; j < 4; j++) {
        socketCollection[j].className = 'js-hint-socket socket';
      }
    }

    // Reset secret code sockets
    for (var i = 0; i < secretSockets.length; i++) {
      secretSockets[i].className = 'secret socket';
      secretSockets[i].innerHTML = '?';
    }

    document.getElementsByTagName('body')[0].className = ''; // Reset background
  }

  // Creates a color sequence that the player needs to guess
  function generateSecretCode (min, max) {
    for (var i = 0; i < 4; i++)
      code[i] = Math.floor(Math.random() * (max - min)) + min;
  }

  // Once the player runs out of guesses or crack the code - the sequence is revealed
  function revealCode () {
    for (var i = 0; i < secretSockets.length; i++) {
      secretSockets[i].className += ' ' + pegs[code[i]];
      secretSockets[i].innerHTML = ''; // Remove "?" from the socket
    }
  }

  function gameOver () {
    // Disable color options
    for (var i = 0; i < options.length; i++)
      options[i].removeEventListener('click', insertGuess, false);

    revealCode();
  }

  function gameState (state) {
    gameOver();
    document.getElementsByTagName('body')[0].className = state;
    modalOverlay.className = state;

    if (state === 'won') {
      modalMessage.innerHTML = '<h2>You cracked the code!</h2> <p>Great! You are awesome! You should feel good now...</p> <button class="large" id="hideModal">OK</button> <button id="restartGame" class="large primary">Restart</button>';
      document.getElementById('restartGame').onclick = newGame;
      document.getElementById('hideModal').onclick = hideModal;
    } else
      modalMessage.innerHTML = '<h2>You failed...</h2> <p>What a shame... Look on the bright side - you weren\'t even close.</p> <button class="large" id="hideModal">OK</button> <button id="restartGame" class="large primary">Restart</button>';
      document.getElementById('restartGame').onclick = newGame;
      document.getElementById('hideModal').onclick = hideModal;
  }

  gameSetup(); // Run the game
}());
