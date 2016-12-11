
/*
ALL functions
*/

// Adds a new game to firebase
function createNewGame(name) {
    //sets the data to send to firdebase
    //NOTE we may add some more data to this
    var data = {
        name: name,
        hasStarted: 0,
        currentMission: 0,
        restartCoreLoop: false
    };

    // Global reference to game data
    game = data;

    //sets the game key to the game name in the repository games with the data
    resistenceRef.child('games/' + name).set(data);
}

function startGame(gameID){
    // Listen to changes in the value of games/gameName/hasStarted
    resistenceRef.child('games/' + gameID).on('value', function(snapshot) {
        var game = snapshot.val()

        // If hastarted is 1 show the waiting div
        if (game.hasStarted == 1 && startingGame == false) {
            $('#lobby').hide();
            $('.userName').text(user.name);
            //byt den här till vänta på ordning
            $('#waitingForOrders').show();
        }
        // If hasStarted is 2 start the game
        if (game.hasStarted == 2 && startingGame == false) {
            $('#waitingForOrders').hide();
            $('.userName').text(user.name);
            //byt den här till vänta på ordning
            $('#beforeShowingRole').show();
        }
    });
}

// Add a new player to a game
function addPlayerToGame(username, game) {
    // resistenceRef = lizzo rep, cild -> players rep, game name is the key to the game we want to add players to,
    // push = adds a new object to firebase with a key. The key are added to the global user object
    // to the object we add username, an place for the role and a varable for later to check if the players are ready
    var userInfo = resistenceRef.child('players/' + game).push();
    user.id = userInfo.key();
    userInfo.set({
        name: username,
        role: "",
        ready: false,
        nominated: false,
        missionleader: false,
        // NOTE
        vote: ""
    });
}

function checkExistingGames(name){
    //NOTE finish this
    //checks if the game already exists
    resistenceRef.child('players/' + name).on('value', function(snapshot) {
        var game = snapshot.val();
        if (game == null) {
            alert("Nytt skapat!");
        } else{
            alert("Game already exists");
        }
    });
}

function getLocalGameBoard(gameName) {
    resistenceRef.child('games/' + gameName).once('value', function(gameSnapshot) {
        var game = gameSnapshot.val();
        if (game.hasStarted == 1) {
            resistenceRef.child('players/' + gameName).once('value', function(playersSnapshot) {
                gameBoard = getBoard(playersSnapshot.numChildren());
            });
        }
    });
}

// Adds roles to all players in active game and starts game by updating hasStarted
function setupRoleList(gameName){
    // Get active game from firebase
    startingGame = true;
    resistenceRef.child('games/' + gameName).once('value', function(gameSnapshot) {
        var game = gameSnapshot.val();
        // Only assign new roles if game has not yet started
        if (game.hasStarted == 0) {
            // start game
            game.hasStarted = 1;
            resistenceRef.child("games/" + gameName).update(game);

            // Assign roles
            resistenceRef.child('players/' + gameName).once('value', function(playersSnapshot) {
                var players = playersSnapshot.val();
                // Number of players
                var numberOfPlayers = Object.keys(players).length;
                // Get randomized rolelist
                var roles = getRandomRoleList(numberOfPlayers);
                // Iterate through all players and assign roles
                for (player in players) {
                    players[player].role = roles.pop(); // randomly assign good/evil
                }
                // Update firebase
                resistenceRef.child("players/" + gameName).update(players);

                // Get the right gameboard with missions based on number of players
                gameBoard = getBoard(numberOfPlayers);
                // Add the board got from getBoard to firebase
                resistenceRef.child('games/' + gameName + "/gameBoard").set(gameBoard);
                dragAndDrop(gameID);
            });
        }
    });
}

function dragAndDrop(gameName){
    // change the order of the players
    //NOTE visa dragand dorp grejern
    resistenceRef.child('players/' + gameName).once('value', function(snapshot) {
        //get the snapshot of the rep and save its value to player
        var players = snapshot.val();
        for (player in players){
            //add the added player to the list of players
            lobbyPlayerList.append("<li>" + players[player].name + "</li>");
        }
    });
    /*
    1 Hämta listan med spelare
    2 flytta spelare i rätt ordning
    3 spara den nya listan i firebase på något sätt
    */
    $('#dragAndDrop').show();
}

// Takes in number of players and return a shuffled list of roles with the same length
function getRandomRoleList(numberOfPlayers){
    var roleList = [];
    // Default number of spies for 5-6 players
    var numberOfSpies = 2;

    // Determines how many spies based on number of players
    if (numberOfPlayers > 6 && numberOfPlayers < 10 ) {
        numberOfSpies = 3;
    } else if (numberOfPlayers == 10) {
        numberOfSpies = 4;
    }

    // Append determined number of spies to RoleList
    for (var i = 0; i < numberOfSpies; i++) {
            roleList.push("spy");
    }

    // Append all roles who are NOT spies to RoleList
    for (var i = 0; i < (numberOfPlayers - numberOfSpies); i++) {
        roleList.push("good");
    }

    // Shuffle rolelist randomly and return it
    var shuffledRoleList = shuffle(roleList);

    return shuffledRoleList;
}

// Get player role and show it to each player and show all spies to all spies
function getUserRole(gameName, userKey){
    resistenceRef.child('players/' + gameName + '/' + userKey).once("value", function(snapshot){
        // Show role to each player in game
        var playerRef = snapshot.val();

        // If user is spy, show all other spies
        user.role = playerRef.role;
        if (user.role == "spy"){
            resistenceRef.child("players/" + gameName).once("value", function(snapshot){
                var players = snapshot.val();
                // Loop through server to find other spies in game
                $('#otherRole').append('Other spies: ');
                for (player in players) {
                    // Look for other spies that are not yourself
                    if (players[player].role == "spy" && players[player].name != playerRef.name){
                        $('#spyList').append('<li class="spies">' + players[player].name + '</li>');
                    }
                }

            });
        };
    });
}

function nominatePlayer(id, gameName) {
    //starts a listener that will listen to when the mission leader presses the nominate button
    //listenToFalsePlayers(gameID);
    // Get how many players are required for mission
    var playersReq = getPlayersRequiredForMission();

    resistenceRef.child("players/" + gameName + "/" + id).once("value", function(snapshot) {
        var player = snapshot.val();
        // invertera värdet för nominated
        var nominated = player.nominated ? false : true;

        if (nominated && playersReq == nominatedPlayers.length) {
            return false;
        }

        if (nominated) {
            nominatedPlayers.push(player.name);
        } else {
            var indexOfPlayer = nominatedPlayers.indexOf(player.name);
            nominatedPlayers.splice(indexOfPlayer, 1);
        }

        var playerInfo = resistenceRef.child("players/" + gameName + "/" + id);
        playerInfo.update({ nominated: nominated });


        // finns redan funktion
        // setNominatedValue(gameName, id, nominated);
        // listenToNominationHighlight(gameName, nominatedPlayers);
        // console.log("nominatedPlayers: ", nominatedPlayers)

    });
}

function getPlayersRequiredForMission(){
    //Batman gets required players for mission
    var mission = currentMission;
    var playersReq = gameBoard[mission].playersRequired;

    return playersReq
}

function setNominatedValue(gameName, userKey, value){
    //sets the value of firebase/players/player/nominated to true
    //if (marked player)
    var userInfo = resistenceRef.child('players/' + gameName + '/' + userKey);
    userInfo.update({
        nominated: value
    });

}

function saveNomineeVote(gameName, userKey, vote){
    // The vote is stored in firebase at the players name
    var userInfo = resistenceRef.child('players/' + gameName + '/' + userKey);
    userInfo.update({
        vote: vote
    });
}

function getApproveVotes(players){
    var approves = 0;
    for (player in players) {
        if (players[player].vote == "approve"){
            approves++;
        };
    };
    return approves;
}

function getRejectVotes(players){
    var rejects = 0;
    for (player in players) {
        if (players[player].vote == "reject"){
            rejects++;
        };
    };
    return rejects;
}

function countVotes(numOfRejects, numOfApproves){
    if(numOfRejects > numOfApproves || numOfRejects == numOfApproves){
        voteTracker++
        nominatedPlayers = [];
        emptyTags();
        return false;
    }
    else{
        voteTracker = 0;
        return true;
    }
}

function emptyTags(){
    var nominateList = document.getElementById("nominatedPlayers");
    while (nominateList.firstChild) {
        nominateList.removeChild(nominateList.firstChild);
    }
    var nominateVote = document.getElementById("nominationVotes");
    while (nominateVote.firstChild) {
        nominateVote.removeChild(nominateVote.firstChild);
    }

    var votesNames = document.getElementById("votesAndNames");
    while (votesNames.firstChild) {
        votesNames.removeChild(votesNames.firstChild);
    }
    var play = document.getElementById("playerList");
    while (play.firstChild) {
        play.removeChild(play.firstChild);
    }
}

function addToVoteTracker(){
    //if the team is rejected the vote tracker should move one step
    if (voteTracker == 1){
        $('#dot1').css( "background-color", "red");
    }
    if (voteTracker == 2){
        $('#dot2').css( "background-color", "red");
    }
    if (voteTracker == 3){
        $('#dot3').css( "background-color", "red");
    }
    if (voteTracker == 4){
        $('#dot4').css( "background-color", "red");
    }
}

function clearVoteTracker(){
    //this clears the vote tracker

}

function setPlayerReadyValue(gameName, userKey, readyValue) {
    // changes players readyValue when used.
    var userInfo = resistenceRef.child('players/' + gameName + '/' + userKey);
    userInfo.update({
        ready: readyValue
    });
}

function setAllPlayerReadyValueFalse(gameName, readyValue){
    //sets all the players ready value to false
    resistenceRef.child("players/" + gameName).once("value", function(snapshot){
        // collect the player objecte from the firebase ref to the specific game
        var players = snapshot.val();
        
        for (player in players) {
            var userInfo = resistenceRef.child('players/' + gameName + '/' + player);
            userInfo.update({
                ready: readyValue
            });
        }
    });
}

function getNominatedNames(gameName){
    // starts in a listener
    //gets all the nominated players from firebase ans adds the to an array
    resistenceRef.child("players/" + gameName).once("value", function(snapshot){
        var players = snapshot.val();
        for (player in players) {
            if (players[player].nominated == true){
                //adds the to the global varibale nominatedPlayers
                nominatedPlayers.push(players[player].name);
            }
        }
    });
}

function allVotesAndNames(players){
    // The players name and Vote are appended as a list element to the step called "voteResult"
    for (player in players){
        votesAndNames.append('<li class="player">' + players[player].name + " - " + players[player].vote + '</li>');
    }
    // Starts a listener that listen for nominated player false
    // Shows the next button only to the missionleader
}

// Show either start mission or nominate new players on button
function showButton(result){
    resistenceRef.child("players/" + gameID).once("value", function(snapshot){
        var players = snapshot.val();
        for (player in players) {
            // If nomination was approved -> show "start mission"-button to mission leader
            if (players[player].nominated == true && result == true){
                $('#startMission').show();
            // If nomination was denied -> show "nominate new players"-button to mission leader
            } else if (players[player].nominated == true && result == false){
                $('#restartNomination').show();
            // You're not mission leader, you don't get any buttons
            } else {
                $('#startMission').hide();
            }
        }
    });
}

function setAllplayersNominatedFalse(gameName){
    resistenceRef.child("players/" + gameName).once("value", function(snapshot){
        var players = snapshot.val();
        //whch users are nominated true
        for (player in players) {
            if (players[player].nominated == true){
                //for each key it sets the value of ready to false
                var x = resistenceRef.child('players/' + gameName + '/' + player);
                x.update({
                    nominated: false
                });
            }
        }
    });
}

//Function that gets the missionleader.
function getMissionLeader (gameName, userKey) {
    resistenceRef.child('players/' + gameName).once('value', function(snapshot){
        //Get all player from firebase, that got the right gameName.
        var allPlayers = snapshot.val();
        //Creates a array to put all players in
        var list= [];
        //going igenom all players and push the player to the array.
        for (player in allPlayers){
            list.push(player);//Get all players and push them into the array = list[]
         }
         //GlobalVariable missionleader will be the first "Player" now the first in the array.(missionleader = the key from firebase)
         missionLeader = list[0];
         if (user.name == allPlayers[missionLeader].name) {
            user.missionleader = true;
         }
         //Update the player gameleader value to true in Firebase.
         var userInfo = resistenceRef.child('players/' + gameName + '/' + missionLeader);
            userInfo.update({
            missionleader: true
        });
    });
}
//Checks if your "enhet" are the missionleader. If so: Hide or show nominate button.
function showNominateButton(){
    if (user.missionleader){
        $('#nominate').show()
    } else {
        $('#nominate').hide();
    }
};

function getNextMissionLeader(gameName){
    resistenceRef.child('players/' + gameName).once('value', function(snapshot){
        //Get all player from firebase, that got the right gameName.
        var allPlayers = snapshot.val();
        //Creates a array to put all players in
        var list= [];
        //creates a new variabel that will be used to add 1 to the index number. So the next missionleader can get selected.
        //going igenom all players and push the player to the array.
        for(player in allPlayers){
            list.push(player);
         }
         //Add 1 to variabel i.
         i = i + 1;
         //if we've gone too high, start from `0` again
         i = i % list.length;
         //Change the global to next element in the array
        var oldMissionLeader = resistenceRef.child('players/' + gameName + '/' + missionLeader);
        oldMissionLeader.update({
            missionleader: false
        });

        missionLeader=list[i];
        //Update the player gameleader value to true in Firebase.
        //GlobalVariable missionleader will be the first "Player" now the first in the array.(missionleader = the key from firebase)
        var userInfo = resistenceRef.child('players/' + gameName + '/' + missionLeader);
            userInfo.update({
            missionleader: true
        });


    });
}

function nominatedShowAgendaCards(gameName){
    // If the player is nominated, shows the fail/accept options
    // Loop through players on mission...
    for (var i = 0; i < nominatedPlayers.length; i++) {
        // ... if you're in the mission...
        if (nominatedPlayers[i] == user.name) {
            // ... show fail/accept
            $('#missionAgenda').show();
            $('#whilePlayersOnMission').hide();
        }
        else if (nominatedPlayers[i] != user.name){
            $('#whilePlayersOnMission').show();
        }
    }

}

// +1 to failSum
function failVote(){
    // NOTE global variable gameID is used for testing, change later

    // Get current mission
    resistenceRef.child('games/' + gameID).once('value', function(gameSnapshot) {
        var game = gameSnapshot.val();
        var mission = game.currentMission;

        // Get current mission from gameboard
        resistenceRef.child('games/' + gameID + "/gameBoard/" + mission).once('value', function(boardSnapshot) {
        var board = boardSnapshot.val();

        // Add a fail to failSum in current mission
        board.failSum++;
        resistenceRef.child('games/' + gameID + "/gameBoard/" + mission).update(board);

        });
    });
}

//Checks if your "enhet" are the missionleader. If so: Hide or show nominate button.
function show(){
    if (user.missionleader){
        $('#nominate').show()
    } else {
        $('#nominate').hide();
    }
};

// Set status of completed mission when all players.nominated == false
function setMissionStatus(mission, gameName){
    var board = resistenceRef.child('games/' + gameName + "/gameBoard/" + mission);

    // If mission failed
    if (board.failSum >= board.failsRequired) {
        // Update mission status to fail in firebase
        board.update({
            missionStatus : "Mission failed!"
        });
        // Update global variable gameBoard
        gameBoard[mission] = board;

    // If mission succeeds
    }
    else {
        // Update mission status to success in firebase
        board.update({
            missionStatus : "Mission succeeded!"
        });
        // Update global variable gameBoard
        gameBoard = board;
    }

    // Update global variable currentMission
    mission++;
    currentMission = mission;
    // Update current mission in firebase
    var game = resistenceRef.child('games/' + gameName);
    game.update({
        currentMission : mission
    });

    // Run displayMissionStatus(board); here?
}

// Display all fails/success-cards
function displayMissionStatus(board){
    // Get fail votes
    var noOfFailVotes = board.failSum;
    // ********** NOTE BUG WHEN ALL PLAYERS PRESS AT THE SAME TIME **********
    // Push all agendas to list...
    var voteResults = [];
    for (var i = 0; i < board.playersRequired; i++) {
        if (noOfFailVotes < i) {
            voteResults.push("Fail");
        } else {
            voteResults.push("Success");
        }
    }
    // ... and shuffle it for display.
    var shuffledVoteResults = shuffle(voteResults);
    // Display in html
    for (var i = 0; i < shuffledVoteResults.length; i++) {
        missionAgendaCards.append("<li>" + shuffledVoteResults[i] + "</li>");
    };

}

// Add to agenda on gameBoard
function agendaPlusOne(gameName, mission){
    var board = resistenceRef.child('games/' + gameName + "/gameBoard/" + mission);
    var playerAgenda = board.agendas + 1;
    board.update({
        agendas : playerAgenda
    })
}

// Procedure when player sets fail on mission, +1 to failSum
function failVote(gameName){
    // NOTE global variable gameID is used for testing, change later

    // Get current mission number
    resistenceRef.child('games/' + gameName).once('value', function(gameSnapshot) {
        var game = gameSnapshot.val();
        var mission = game.currentMission;

        // Get current mission information from gameboard
        resistenceRef.child('games/' + gameName + "/gameBoard/" + mission).once('value', function(boardSnapshot) {
        var board = boardSnapshot.val();

        // Add a fail to failSum in current mission
        board.failSum++;
        resistenceRef.child('games/' + gameName + "/gameBoard/" + mission).update(board);

        });
    });
}

//Checks if your "enhet" are the missionleader. If so: Hide or show nominate button.
function showNextMissionButton(){
    if (user.missionleader){
        $('#nextMission').show()
    } else {
        return false;
    }
};

function addToCurrentMission(gameName){
    // Update global variable currentMission
    currentMission ++;
    // Update current mission in firebase
    var game = resistenceRef.child('games/' + gameName);
    game.update({
        currentMission : currentMission
    });
}

function setCoreLoopValue(gameName, value){
    //sets core loop value and to restart the loop
    var game = resistenceRef.child('games/' + gameName);
    game.update({
        restartCoreLoop : value
    });
}

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
  }

  return array;
}
