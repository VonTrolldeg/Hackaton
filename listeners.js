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
  //listen to everything that changes under the current game name
    console.log("Listener 'listenToGameStart' activated");
    // Get game object from firebase
    firebaseRef.child("games/" + gameName).on("value", function(snapshot) {
        var gameRef = snapshot.val();
        // Setup all player roles
        setupRoleList(globalGameName);
        if (gameRef.gamePhase == 3 && globalUserInfo.missionLeader) {
          // Show step 3 - Drag and Drop for the gameleader
          dragAndDrop(globalGameName);
      } else if (gameRef.gamePhase == 3 && !globalUserInfo.missionLeader) {
          //show "waiting for player order"
          $("#waitingForOrders").show();
        };
    });
};
