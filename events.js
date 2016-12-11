/*
ALL the events
*/
createGame.on('click', function() {
    //when someone clicks create new game
    user.name = $('#username').val();
    var gameName = $('#game-name').val().toLowerCase();

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
    lisetenTostartGame(gameID);

    //hides step 1 shows next step
    $('#game-form-step-1').hide();
    $('#gameNameDisplay').text(gameName);
    $('#lobby').show();
});

joinGame.on('click', function() {
    // when someone clicks join game set create game to false cus we're not creating a new game
    user.name = $('#username').val();
    var gameName = $('#game-name').val().toLowerCase();

    // NOTE: check if game exists
    // If the player are joining an existing game with that already has a name
    gameID = gameName;
    // Adds a new player to an existing game
    addPlayerToGame(user.name, gameName);

    listenToNewPlayerNames(gameName);
    listenToRemovedPlayerNames(gameName);
    lisetenTostartGame(gameID);

    //hides step 1 shows next step
    $('#game-form-step-1').hide();
    $('#gameNameDisplay').text(gameName);
    $('#lobby').show();
});


startGame.on('click', function() {
    //runs the function that sets the values for firebase/games/hasstarted
    setupRoleList(gameID);
    getMissionLeader(gameID, user.id);
    getLocalGameBoard(gameID);
    //listenToCoreLoopRestart(gameID);
    $('#lobby').hide();
});

orderDone.on('click', function() {
    //changes the value of  firebase/games/hasstarted to 2
    resistenceRef.child('games/' + gameID).once('value', function(gameSnapshot) {
        var gameRef = gameSnapshot.val();
        // change the value to 2
        gameRef.hasStarted = 2;
        resistenceRef.child("games/" + gameID).update(gameRef);
    });
    $('#dragAndDrop').hide();
    $('.userName').text(user.name);
    $('#beforeShowingRole').show();
});

showRole.on('click', function(){
    //runs the functions that displays the players role
    resistenceRef.child('games/' + gameID).once('value', function(gameSnapshot) {
        var gameRef = gameSnapshot.val();
        // change the value to 2
        gameRef.hasStarted = 3;
        resistenceRef.child("games/" + gameID).update(gameRef);
    });
    getUserRole(gameID, user.id);
    $('#beforeShowingRole').hide();
    $('.userName').text(user.name);
    $('#role').text(user.role);
    $('#ShowingRole').show();
    getMissionLeader(gameID, user.id);
    showNominateButton();
    listenToReadyPlayers(gameID);

});

hideRole.on('click', function(){
    //displays the ready button and hides the role
    getUserRole(gameID, user.id);
    $('#ShowingRole').hide();
    $('.userName').text(user.name);
    //NOTE när man tryckt på ready ändra till waiting
    $('#waitingForPlayers').show();
    // var readyValue = true;
    setPlayerReadyValue(gameID, user.id, true);
});

nominate.on('click', function(){
    //hide step show step
    $('#nominate').hide();
    // set the ready value to false so we can set them true agian when they vote
    setAllPlayerReadyValueFalse(gameID, false);

});

approve.on('click', function(){
    //starts with updating players/userID/ready to false
    //hide step show step
    $('#nominationVote').hide();
    $('#waitingForNominationVotes').show();
    // set the ready value to true
    setPlayerReadyValue(gameID, user.id, true);
    //save the vote for this player
    saveNomineeVote(gameID, user.id, "approve");
    //collect all votes and count them
    // collectVotes(gameID);
    listenToReadyPlayersVoting(gameID);
});

reject.on('click', function(){
    //starts with updating players/userID/ready to false
    //hide step show step
    $('#nominationVote').hide();
    $('#waitingForNominationVotes').show();
    // set the ready value to true
    setPlayerReadyValue(gameID, user.id, true);
    //save the vote for this player
    saveNomineeVote(gameID, user.id, "reject");
    //listenToNewMissionleader(gameID);
    // collectVotes(gameID);
    listenToReadyPlayersVoting(gameID);
    listenToCoreLoopRestart(gameID)
});

// When player click to succeed mission
success.on("click", function(){
    // Add one to agenda on gameBoard.currentMission to signal that mission is completed for the player
    agendaPlusOne(gameID, currentMission);
    /*
    //Change current mission +1 and
    setMissionStatus(mission);
    */
    // NOTE HIDE SHIT AFTER
    $('#missionAgenda').hide();
    $('#whilePlayersOnMission').show();
});

// When player click to fail mission
fail.on("click", function(){
    // failSum + 1
    failVote(gameID);
    // Add one to agenda on gameBoard.currentMission to signal that mission is completed for the player
    agendaPlusOne(gameID, currentMission);
    // NOTE HIDE SHIT AFTER
    $('#missionAgenda').hide();
    $('#whilePlayersOnMission').show();
});

rightArrow.on("click", function(){
    $('#missions').show();
    leftArrow.show();
    rightArrow.hide();
});

leftArrow.on("click", function(){
    $('#missions').hide();
    rightArrow.show();
    leftArrow.hide();
});

nextMission.on("click", function(){
    // -> set next mission leader
    getNextMissionLeader(gameID);
    // -> add one to currentMission
    addToCurrentMission(gameID);
    //NOTE function 470 ska det inte vara den globala current mission där?
    // -> run coreLoop
    $('#displayMissionAgenda').hide();
    showNominateButton();
    $('#playerList').show();
    $('#coreLoop').show();
    // -> set ready to false
    setAllPlayerReadyValueFalse(gameID, false)
    // -> reset all votes????
});
