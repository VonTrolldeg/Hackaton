/*
ALL listeners
*/
// Add list elements from player names
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
            playerList.append('<li class="player">' + players[player].name + '</li>');
        }
        resistenceRef.child('players/' + gameName).off("value", listenIfReady);
        $('#header').hide();
        $('#waitingForPlayers').hide();
        $('#coreLoop').show();
    });
}

function listenToReadyPlayersVoting(gameName, result){
    //listen to when player value ready has changed to true
    // Get the data on a post that has changed
    resistenceRef.child('players/' + gameName).on("value", function listenIfReady(snapshot) {
        var players = snapshot.val();
        for (player in players){
            if (players[player].ready == false){
                return false;
            }
        }
        resistenceRef.child('players/' + gameName).off("value", listenIfReady);
        $('#waitingForNominationVotes').hide();
        $('#nominationVotes').append(result)
        $('#voteResult').show();
        // display all names together with what they voted 
        allVotesAndNames(gameID);
    });
}
//Funkar delvis
function DisplayForMissionLeader(gameName) {
    resistenceRef.child('players/' + gameName).once('value', function(snapshot){
        var players = snapshot.val()
        for(player in players) {
            if(players[player].missionleader == true){
                $('#nominate').show();
            } else {
                $('#nominate').hide();
            }

        }
    });
}

