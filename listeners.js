/* 
    ***** LISTENERS *****
*/

function listenToPlayersJoining(gameName) {
    console.log("Listener 'listenToPlayerJoining' activated"); // For testing
    // When a child element is added to players repository...
    firebaseRef.child("players/" + gameName).on("child_added", function(snapshot){
        // Get snapshot of repository and save value
        var playerAdded = snapshot.val();
        // Append new player to Lobby HTML
        $("#lobby-players").append("<li>" + playerAdded.name + "</li>");
    });
};

function listenToPlayersLeaving(gameName) {
    // NOTE: NOT BUILT
};

function listenToGameStart(gameName) {
    console.log("Listener 'listenToGameStart' activated");
    // Get game object from firebase
    firebaseRef.child("games/" + gameName).on("value", function(snapshot) {
        var gameRef = snapshot.val();
        if (gameRef.gamePhase == 2 && globalUserInfo[missionLeader]) {

        } else if (gameRef.gamePhase == 2 && !globalUserInfo[missionLeader]) {

        };
    });
};