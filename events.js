/*
   ***** EVENTS *****
*/

/*
    Events in step 1 - Create/Join game
*/

// Event when clicking Create game
$("#create-game").on("click", function(){
    var nameInput = $("#username").val();
    var gameInput = $("#game-name").val();

    // Fetch input and test if undefined (or already in use)
    if (testNewGameInput(nameInput, gameInput)) {
        // If both fields are filled out -> create game
        createNewGame(gameInput);
        // Add player to server and game, set host status as true
        addPlayerToServer(nameInput, gameInput, true);

        // Save global variable globalGameName
        globalGameName = gameInput;

        // Listen to new players joining game
        listenToPlayersJoining(gameInput);
        // Listen to players leaving game
        listenToPlayersLeaving(gameInput); // NOTE: NOT BUILT
        // Move from step one to step two
        moveToStepTwo(gameInput);
        // Start listener to check if player starts game
        listenToGameStart(gameInput);
    };
});

// Event when clicking Join game
$("#join-game").on("click", function(){
    var nameInput = $("#username").val();
    var gameInput = $("#game-name").val();

    // Fetch input and test if undefined (or already in use <-- !Add later!)
    if (testJoinGameInput(nameInput, gameInput)) {
        // Add player to server and game, set host status as false
        addPlayerToServer(nameInput, gameInput, false);
        // Save global variable globalGameName
        globalGameName = gameInput;

        // Listen to new players joining game
        listenToPlayersJoining(gameInput);
        // Listen to players leaving game
        listenToPlayersLeaving(gameInput); // NOTE: NOT BUILT
        // Move from step one to step two
        moveToStepTwo(gameInput);
        // Start listener to check if any player starts game
        listenToGameStart(gameInput);
    };
});

/*
    Events in step 2 - Lobby
*/

// Event when pressing start game in lobby
$("#start-game").on("click", function(){
    // Hide lobby step
    $("#lobby").hide();
    // Start game session
    startGameSession(globalGameName);


});

/*
    Events in step 3 - Drag and drop
*/

$("#orderDone").on("click", function () {

});
