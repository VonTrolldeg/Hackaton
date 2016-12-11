/*
ALL listeners
*/

function lisetenTostartGame(gameID){
    // Listen to changes in the value of games/gameName/hasStarted
    resistenceRef.child('games/' + gameID).on('value', function(snapshot) {
        var gameRef = snapshot.val()

        // If hastarted is 1 show the waiting div
        if (gameRef.hasStarted == 1 && startingGame == false) {
            $('#lobby').hide();
            $('.userName').text(user.name);
            //byt den här till vänta på ordning
            $('#waitingForOrders').show();
        }
        // If hasStarted is 2 start the game
        if (gameRef.hasStarted == 2 && startingGame == false) {
            // Get the right gameboard with missions based on number of players
            gameBoard = gameRef.gameBoard;
            $('#waitingForOrders').hide();
            $('.userName').text(user.name);
            //byt den här till vänta på ordning
            $('#beforeShowingRole').show();
        }
        else{
            //do nothing for now
        }
    });
}


function listenToNewPlayerNames(gameName) {
    //when a child is added to the players rep
    resistenceRef.child('players/' + gameName).on('child_added', function(snapshot) {
        //get the snapshot of the rep and save its value to player
        var player = snapshot.val();
        //add the added player to the list of players
        lobbyPlayerList.append("<li>" + player.name + "</li>");
    });
}

//if a name is removed
function listenToRemovedPlayerNames(gameName){
    // when a cild is removed from the rep take a snapshot of the name
    resistenceRef.child('players/' + gameName).on('child_removed', function(snapshot){
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

function listenToReadyPlayers(gameName){
    //listen to when player value ready has changed to true
    // Get the data on a post that has changed
    resistenceRef.child('players/' + gameName).on("value", function listenIfReady(snapshot) {
        var players = snapshot.val();
        for (player in players){
            if (players[player].ready == false){
                return false;
            }
        }

        for (player in players){
            if (players[player].missionleader == true){
                playerList.append('<li class="player" data-id="' + player + '"><img src="star.png" class="star">' + players[player].name + '</li>');
            }
            else if (players[player].missionleader == false){
                playerList.append('<li class="player" data-id="' + player + '">' + players[player].name + '</li>');
            }
        }

        resistenceRef.child('players/' + gameName).off("value", listenIfReady);
        $('#header').hide();
        $('#waitingForPlayers').hide();
        $('#voteResult').hide();
        $('#playerList').show();
        $('#coreLoop').show();
        showNominateButton();
        //starts a listener that will listen to when the mission leader presses the nominate button
        listenToFalsePlayers(gameID);
        // markNominatedPlayer(gameName);
        // listenToPlayerNominees()
        listenToNominationHighlight(gameName);

        if (user.missionleader){
            $('.player').on("click", function() {
                var playerID = $(this).data('id');
                nominatePlayer(playerID, gameName);
            });
        }
    });
}

function listenToReadyPlayersVoting(gameName, numOfRejects, numOfApproves){
    //listen to when player value ready has changed to true
    // Get the data on a post that has changed
    var result = countVotes(numOfRejects, numOfApproves);
    resistenceRef.child('players/' + gameName).on("value", function listenIfReady(snapshot) {
        var players = snapshot.val();
        for (player in players){
            if (players[player].ready == false || players[player].vote == ''){
                return false;
            }
        }
        /*
        var numOfApproves = getApproveVotes(players);
        var numOfRejects = getRejectVotes(players);
        var result = countVotes(numOfRejects, numOfApproves); // döp om
        */
        resistenceRef.child('players/' + gameName).off("value", listenIfReady);
        $('#waitingForNominationVotes').hide();
        // Display result
        if (result) {
            var displayResult = "Team is accepted!"
        } else{
            var displayResult = "Team is denied!"
        };
        $('#nominationVotes').append(displayResult);
        $('#voteResult').show();
        // display all names together with what they voted
        listenToNewMissionleader(gameName)
        allVotesAndNames(players, result);
        showButton(result);
        if (numOfRejects > numOfApproves || numOfRejects == numOfApproves) {
            // didnt pass
            restartNomination.on('click', function(){
                $('#nominationVote').hide();
                $('#waitingForNominationVotes').show();
                getNextMissionLeader(gameID);
                // set the ready value to true
                addToVoteTracker();
                setPlayerReadyValue(gameID, user.id, true);
                //save the vote for this player
                saveNomineeVote(gameID, user.id, "reject");
                //listenToNewMissionleader(gameID);
                // collectVotes(gameID);
                //change css on dot on vote tracker
                //setAllplayersNominatedFalse(gameName);
                //setCoreLoopValue(gameID, true);
                // -> reset all votes????
                // -> run coreLoop
                //setCoreLoopValue(gameID, true);
            });
            // -> set next mission leader
            // -> add counter to vote tracker
            // -> reset nominated player list
            // -> restart nomination?
            // -> reset all votes?
            // -> reset all ready (to false)?
        } else {
            listenToMissionAgenda(gameID, currentMission);

            startMission.on("click", function(){
                //setAllplayersNominatedFalse(gameID);
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
            });
            // -> get new mission
            // -> reset nominated player list
            // ->
        }
    });
}

function listenToNominationHighlight(gameName){
    resistenceRef.child('players/' + gameName).on("value", function listenToNomination(snapshot) {
        var players = snapshot.val();

        // GET PLAYERS REQUIRED AND IF-SATS AROUND CODE ALL BELOW
        $('#playerList .player').forEach(function(li) {
            var id = $(li).data('id');
            var p = players[id];

            if (p.nominated) {
                $(li).css( "background-color", "rgba(0, 0, 255, 0.5);");

            } else {
                $(li).css( "background-color", "rgba(255, 255, 255, 0.5);");

            }
        });
    });
}


function listenToFalsePlayers(gameName){
    //local array to replace the global nominated varable for everyone
    var nominees = [];
    //listen to when player value ready has changed to false whech will happen when missionleader presses nominate
    resistenceRef.child('players/' + gameName).on("value", function listenIfReady(snapshot) {
        var players = snapshot.val();
        for (player in players){
            if (players[player].ready == true){
                return false;
            }
        }
        //if they are all false the listener stops
        resistenceRef.child('players/' + gameName).off("value", listenIfReady);

        //find the nominated players and print out their names
        for (player in players){
            if (players[player].nominated == true){
                nominees.push(players[player].name);
                $('#nominatedPlayers').append('<h3>' + players[player].name + '</h3>');
            }
            /*if (players[player].missionleader == true){
                console.log(players[player].name);
                startMission.show()
            }*/
        }
        //hide the list of players and show the nominated players
        $('#playerList').hide();
        nominatedPlayers = nominees;
        //and it shows the nominationvote step
        $('#nominationVote').show();
    });
}

function listenToNewMissionleader(gameName){
    resistenceRef.child('players/' + gameName).on('value', function batman(snapshot){
        //Get all player from firebase, that got the right gameName.
        var allPlayers = snapshot.val();
        //going igenom all players and push the player to the array.
        for (player in allPlayers){
            if(user.name == allPlayers[player].name && allPlayers[player].missionleader == true){
                user.missionleader = true;
                missionLeader = player;
                console.log('jag har blivit mission leader', allPlayers[player]);
            } else {
                user.missionleader = false;
                console.log('jag är inte mission leader', allPlayers[player]);
            }
        }
        resistenceRef.child('players/' + gameName).off("value", batman);

    });
}

function listenToCoreLoopRestart(gameName){
    resistenceRef.child('games/' + gameName).on('value', function(snapshot){
        //Get all player from firebase, that got the right gameName.
        var restartCoreLoop = snapshot.val();
        //going igenom all players and push the player to the array.
        if (restartCoreLoop.restartCoreLoop == true){
            listenToReadyPlayers(gameName);
            setAllPlayerReadyValueFalse(gameName, true);

        }
    });
}

// listen to misson agenda
function listenToMissionAgenda(gameName, mission){
    // ran from functions allVotesAndNames()
    // Listen to changes in the value of games/gameName/hasStarted
    resistenceRef.child('games/' + gameName + '/gameBoard/' + mission).on('value', function(snapshot) {
        var boardRef = snapshot.val()
        //starts a listener that will listen to when the mission leader presses the nominate button
        listenToFalsePlayers(gameID);
        // When the votes are as many as the players required for the mission the votin is done
        if (boardRef.agendas == boardRef.playersRequired) {
            $('#missionAgenda').hide();
            $('#whilePlayersOnMission').hide();
            //Only the missionleader can move on to hte next mission
            showNextMissionButton(gameID);
            // Show the result of the mission
            $('#displayMissionAgenda').show();
            //run the function that display the mission
            displayMissionStatus(gameBoard[currentMission]);
        }
        else{
            return false;
        }
    });
}