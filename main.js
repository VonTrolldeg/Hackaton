// var baseurl = "https://resistence.firebaseio.com/";
/*all of the global variables are at the top
then all eventhandelers
then all functions that do something
Devide the functions in to small functions*/

/*
ALL Lobal variables!
*/

//link to firebase
var baseurl = "https://resistence.firebaseio.com/";

//referense to the main  repository
var resistenceRef = new Firebase(baseurl);



//making glboal variables of the buttons
var createGame = $('#create-game'),
    joinGame = $('#join-game'),
    submitGame = $('#submit-game'),
    startGame = $('#start-game')
    showRole = $('#showRole'),
    hideRole = $('#hideRole');

//global varable with all the players in the lobby
var lobbyPlayerList = $('#lobby-players');

//global varables for the stte of the game
//varför gjorde vi en dict av den?
var user = { name: "", id: "", role: ""};
var game;
var gameID;

/*
ALL the events
*/
createGame.on('click', function() {
    //when someone clicks create new game
    user.name = $('#username').val();
    var gameName = $('#game-name').val();

    //checks if the game name already exists
    //checkExistingGames(gameName);
    // if createNewGame is true set the game ID to the name the creator gave the game
    gameID = gameName;
    // Creates a new game @ firebase
    createNewGame(gameName);
    // Adds a new player to a game
    addPlayerToGame(user.name, gameName);
    listenToNewPlayerNames(gameName);
    listenToRemovedPlayerNames(gameName);

    // NOTE COMMENTING NEEDED
    resistenceRef.child('games/' + gameID).on('value', function(snapshot) {
        console.log('something changed for our game');

        var game = snapshot.val()

        if (game.hasStarted == true) {
            console.log('has started changed', game);
            $('#lobby').hide();
            $('.userName').text(user.name);
            $('#beforeShowingRole').show();
        }
    });

    //hides step 1 shows next step
    $('#game-form-step-1').hide();
    $('#gameNameDisplay').text(gameName);
    $('#lobby').show();
});

joinGame.on('click', function() {
    // when someone clicks join game set create game to false cus we're not creating a new game
    user.name = $('#username').val();
    var gameName = $('#game-name').val();

    // NOTE: check if game exists
    // If the player are joining an existing game with that already has a name
    gameID = gameName;
    // Adds a new player to an existing game
    addPlayerToGame(user.name, gameName);

    listenToNewPlayerNames(gameName);
    listenToRemovedPlayerNames(gameName);

    //hides step 1 shows next step
    $('#game-form-step-1').hide();
    $('#gameNameDisplay').text(gameName);
    $('#lobby').show();
});


startGame.on('click', function() {
    var numberOfPlayers = $("#lobby-players li").length;
    if (numberOfPlayers >= 5 && numberOfPlayers <=10){
        // Necessary?
        var gameName = gameID;
        // Update firebase with assigned roles to all players in game
        setupRoleList(gameName);
    }
    else{
        console.log("ni är för många eller för få");
    }
    //hides the step and shows the next step with the game name and the name of the player
    $('#lobby').hide();
    $('.userName').text(user.name);
    $('#beforeShowingRole').show();
});

showRole.on('click', function(){
    //runs the functions that displays the players role
    getUserRole(gameID, user.id);
    $('#beforeShowingRole').hide();
    $('.userName').text(user.name);
    $('#role').text(user.role);
    $('#ShowingRole').show();
});

hideRole.on('click', function(){
    //displays the ready button and hides the role
    getUserRole(gameID, user.id);
    $('#ShowingRole').hide();
    $('.userName').text(user.name);
    //NOTE när man tryckt på ready ändra till waiting
    $('#ready').show();
})

/*
ALL functions
*/

// Adds a new game to firebase
function createNewGame(name) {
    //sets the data to send to firdebase
    //NOTE we may add some more data to this
    var data = {
        name: name,
        hasStarted: false,
        currentMission: 0
    };

    // Global reference to game data
    game = data;

    //sets the game key to the game name in the repository games with the data
    resistenceRef.child('games/' + name).set(data);
};

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
        ready: false
    });
};

function checkExistingGames(name){
    //NOTE finish this
    //checks if the game already exists
    resistenceRef.child('players/' + name).on('value', function(snapshot) {
        var game = snapshot.val();
        if (game == null) {
            alert("Nytt skapat!");
        } else{
            alert("Game already exists");
        };
    });
};

// Adds roles to all players in active game and starts game by updating hasStarted
function setupRoleList(gameName){
    // Get active game from firebase
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

                // Iterate through all players and assign roles
                for (player in players) {
                    players[player].role = roles.pop(); // randomly assign good/evil
                };

                // Update firebase
                resistenceRef.child("players/" + gameName).update(players);

            });
        };
    });
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

// Get player role and show it to each player and show all spies to all spies
function getUserRole(gameName, userKey){
    resistenceRef.child('players/' + gameName + '/' + userKey).once("value", function(snapshot){
        // Show role to each player in game (console.log for now)
        var playerRef = snapshot.val();
        console.log("You are " + playerRef.role);

        // If user is spy, show all other spies
        user.role = playerRef.role;
        if (user.role == "spy"){
            resistenceRef.child("players/" + gameName).once("value", function(snapshot){
                var players = snapshot.val();
                // Loop through server to find other spies in game
                console.log("All spies: ") // Testing
                for (player in players) {
                    if (players[player].role == "spy"){
                        console.log(players[player].name);
                    }; 
                };

            });
        };
    }); 
        
};

/*
ALL listeners
*/

// Add list elements from player names
function listenToNewPlayerNames(game) {
    //when a child is added to the players rep
    resistenceRef.child('players/' + game).on('child_added', function(snapshot) {
        //get the snapshot of the rep and save its value to player
        var player = snapshot.val();
        //add the added player to the list of players
        lobbyPlayerList.append("<li>" + player.name + "</li>");
    });
}

//if a name is removed
function listenToRemovedPlayerNames(game){
    // when a cild is removed from the rep take a snapshot of the name
    resistenceRef.child('players/' + game).on('child_removed', function(snapshot){
        //save the value of hte snapshot
        var player = snapshot.val();

        // a zepto event called each that gives the index of a litst item and the item
        $("#lobby-players li").each(function(index, li){
            //if one of the list items are equal to player name that is removed
            if ($(li).text() == player.name){
                //remove it
                $(this).remove();
            }
        });
    });
}
