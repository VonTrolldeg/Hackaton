/* 
    ***** FUNCTIONS *****
*/

/* 
    Functions for step 1 - create/join game
*/


// Checks user input when creating game 
function testNewGameInput(name, game) {

    // Check if not undefined (empty)
    if (name.length == 0 || game.length == 0 ) {
        alert("You haven't filled in all input fields");
        return false;
    // If not empty - create game
    } else {
        // NOTE: Check if game name exists already here
        
        return true;
    };
};

// Checks user input when joining game 
function testJoinGameInput(name, game) {

    // Check if not undefined (empty)
    if (name.length == 0 || game.length == 0 ) {
        alert("You haven't filled in all input fields");
        return false;
    // If not empty - join game
    } else {
        // NOTE: Check if game exists here

        return true;
    };
};


// Create new game
function createNewGame(game) {
    // Add game data to Firebase server
    var gameData = {
        gamePhase : 2, // Control variable to see if game has started - bool
        currentMission : 0, // Controls mission number - int 
        restartCoreLoop : false //Controls if to restart core loop - bool
    };


    // Creates game with input game name as key on Firebase server
    firebaseRef.child("games/" + game).set(gameData);
};

// Add new player data to global object and firebase server 
function addPlayerToServer(newUser, gameName, isHost) {
    // Create player on firebase server
    var firebaseUserInfo = firebaseRef.child("players/" + gameName).push();
    // Get firebase generated ID, clone to global var
    globalUserInfo.id = firebaseUserInfo.key();
    // Update global userInfo var with name and hosting status 
    globalUserInfo.name = newUser;
    globalUserInfo.hostStatus = isHost;

    // Set up player data to Firebase server
    firebaseUserInfo.set({
        name : newUser, // Username - String
        playerRole : true, // Player Role - Bool (false = evil, true = good)
        missionLeader : isHost, // If player is missionLeader
        nominated : false, // If player is nominated for mission - Bool
        hasVoted : false, // If player has voted on mission        
    });
    
};

/* 
    Functions for step 2 - lobby
*/

function moveToStepTwo(gameName) {
    // Iterate on gamePhase in firebase
    firebaseRef.child("games/" + gameName).once("value", function(snapshot) {
        var game = snapshot.val();
        game.gamePhase++
        firebaseRef.child("games/" + gameName).update(game);
        console.log(game.gamePhase);
    });
    // Hide step 1 - Join/Create Game
    $("#game-form-step-1").hide();
    // Show game name and step 2 - Lobby
    $("#gameNameDisplay").text(gameName);
    // If host -> show lobby + start game button,
    // If NOT host -> show lobby without start game button
    if (globalUserInfo.hostStatus) {
        $("#lobby").show();
    } else {
        $("#start-game").hide();
        $("#lobby").show();
    };  
    
};

function setupRoleList(gameName) {
    firebaseRef.child("players/" + gameName).once("value", function(snapshot) {
        var players = snapshot.val();
        // Get number of players in game
        var numberOfPlayers = Object.keys(players).length;
        // Get shuffled array of roles based on number of players
        var gameRoles = getRandomRoleList(numberOfPlayers);
        // Loop through players in game
        for (player in players) {
            players[player].role = gameRoles.pop(); // randomly assign false/true roles
        };

        // Update firebase
        firebaseRef.child("players/" + gameName).update(players);

        // Setup gameboard
        setupBoard(numberOfPlayers);

    });
};

function startGameSession(gameName) {
    firebaseRef.child("games/" + gameName).once("value", function(snapshot) {
        var game = snapshot.val();

        if (game.gamePhase == 2) {
            game.gamePhase == 3;

            firebaseRef.child("games/" + gameName).update(game);
        }; 
    });
};

// Takes in number of players and return a shuffled list of roles with the same length
function getRandomRoleList(numberOfPlayers){
    var roleList = [];
    // Default number of spies for 5-6 players
    var numberOfSpies = 2;

    // Determines how many spies based on number of players
    if (numberOfPlayers > 6 && numberOfPlayers < 10 ) {
        // 7-9 players -> 3 spies
        numberOfSpies = 3;
    } else if (numberOfPlayers == 10) {
        // 10 players -> 4 spies
        numberOfSpies = 4;
    }

    // Append determined number of spies to RoleList
    for (var i = 0; i < numberOfSpies; i++) {
            roleList.push(false);
    }

    // Append all roles who are NOT spies to RoleList
    for (var i = 0; i < (numberOfPlayers - numberOfSpies); i++) {
        roleList.push(true);
    }

    // Shuffle rolelist randomly and return it
    var shuffledRoleList = shuffle(roleList);

    return shuffledRoleList;
};

// Shuffles roles for getRandomRoleList
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  };

  return array;
};

function setupBoard(numberOfPlayers) {
    // Get the right gameboard with missions based on number of players
    var gameBoard = getBoard(numberOfPlayers);
    // Add the board got from getBoard to firebase
    firebaseRef.child('games/' + globalGameName + "/gameBoard").set(gameBoard);
    
};

/* 
    Functions for step 3 - Drag and Drop
*/

function dragAndDrop(gameName) {
    // 1. Get list of all players
    // 2. Drag and drop functionality
    // 3. Save new list in firebase

    $("#dragAndDrop").show();
}

