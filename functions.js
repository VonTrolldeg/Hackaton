
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
        currentMission: 0
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
        nominated: false
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

// Adds roles to all players in active game and starts game by updating hasStarted
function setupRoleList(gameName){
    // Get active game from firebase
    startingGame = true;
    resistenceRef.child('games/' + gameName).once('value', function(gameSnapshot) {
        var game = gameSnapshot.val();
        // Only assign new roles if game has not yet started
        if (game.hasStarted == false) {
            // start game
            game.hasStarted = true;
            resistenceRef.child("games/" + gameName).update(game);

            // Assign roles
            resistenceRef.child('players/' + gameName).once('value', function(playersSnapshot) {
                var players = playersSnapshot.val();
                // Number of players
                var numberOfPlayers = Object.keys(players).length;

                // Get randomized rolelist
                var roles = getRandomRoleList(numberOfPlayers);

                // ***************************************************************************
                // NOTE Code below should probably be elsewhere, just convenient
                // to place here because alla needed parameters are here (numberOfPlayer & gameName)

                // Get the right gameboard with missions based on number of players and add to global variable
                gameBoard = getBoard(numberOfPlayers);

                // Add the board got from getBoard to firebase
                resistenceRef.child('games/' + gameName + "/gameBoard").set(gameBoard);
                // ***************************************************************************

                // Iterate through all players and assign roles
                for (player in players) {
                    players[player].role = roles.pop(); // randomly assign good/evil
                };

                // Update firebase
                resistenceRef.child("players/" + gameName).update(players);
                dragAndDrop(gameID);
            });
        }
    });
}

function dragAndDrop(gameName){
    // change the order of the players
    //NOTE visa dragand dorp grejern
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
        // Show role to each player in game (console.log for now)
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

function markNominatedPlayer(gameName){
    //här kommer kod
    var n = 0
    var nominated =[]
    resistenceRef.child("games/" + gameName).once("value", function(snapshot){
        var mission = snapshot.val();
        if (n < currentMission[mission]){
            //om listan inte är full lägg till den i listan
            $(this).css( "background-color", "rgba(0, 0, 255, 0.5);");
            nominated.push($(this).text());
            n++;
        }
        if (this in nominated){
            nominated.splice(this, 1)
            $(this).css( "background-color", "rgba(255, 255, 255, 0.5);");
        }
    });
}

function saveNomineeVote(gameName, userKey, vote){
    // The vote is stored in firebase at the players name
    var userInfo = resistenceRef.child('players/' + gameName + '/' + userKey);
    userInfo.update({
        vote: vote
    });
}

function collectVotes(gameName){
    //collect the votes
    resistenceRef.child("players/" + gameName).once("value", function(snapshot){
        var players = snapshot.val();
        var numOfApproves = getApproveVotes(players);
        var numOfRejects = getRejectVotes(players);
        var result = countVotes(numOfRejects, numOfApproves);
        listenToReadyPlayersVoting(gameName, result);
    });
};

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
        return "The team is rejected ";
    }
    else{
        return "The team is accepted ";
    }
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
        // new array to hold all the player keys
        var userKeys = [];
        // loops through the objects and push the key to the array
        for (player in players) {
            userKeys.push(player);
        }
        //for each key it sets the value of ready to false
        for (key in userKeys){
            var userInfo = resistenceRef.child('players/' + gameName + '/' + userKeys[key]);
            userInfo.update({
                ready: readyValue
            });
        }
    });
}

function allVotesAndNames(gameName){
    // All players in the game are collected from the firebase
    resistenceRef.child('players/' + gameName).once("value", function(snapshot) {
        var players = snapshot.val();

        // The players name and Vote are appended as a list element to the step called "voteResult"
        for (player in players){
            votesAndNames.append('<li class="player">' + players[player].name + " - " + players[player].vote + '</li>');
        }
    });
}

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
        missionleader: false
    });
}

function getMissionLeader (gameName, missionleader) {
    resistenceRef.child('players/' + gameName).once('value', function(snapshot){
        //Get all player from firebase, that got the right gameName.
        var allPlayers = snapshot.val();
        //Creates a array to put all players in
        var list= [];
        //going igenom all players and push the player to the array.
        for(player in allPlayers){
            list.push(player);//Get all players and push them into list[]
         }
         //GlobalVariable missionleader is right now the first player in the array.
         missionLeader = list[0];
         //Update the player gameleader value to true in Firebase.
         var userInfo = resistenceRef.child('players/' + gameName + '/' + missionLeader);
            userInfo.update({
            missionleader: true
        });
        //Just some console to see if it is the right player that get to be gameleader.
         console.log(missionLeader);
    });
}

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
         missionLeader=list[i];

         var userInfo = resistenceRef.child('players/' + gameName + '/' + missionLeader);
            userInfo.update({
            missionleader: true
        });
        //Just some console to see if it is the right player that get to be gameleader.
        console.log(missionLeader);
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
