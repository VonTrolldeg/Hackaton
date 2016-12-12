
/*
ALL Global variables!
*/

//link to firebase
var baseurl = "https://asres.firebaseio.com/";

//referense to the main  repository
var firebaseRef = new Firebase(baseurl);

// Define user object
var globalUserInfo = {
    name : "", // Username - String
    id : "", // Randomly generated ID - String
    playerRole : true, // Player Role - Bool (false = evil, true = good)
    missionLeader : false, // If player is missionLeader
    nominated : false, // If player is nominated for mission - Bool
    hasVoted : false, // If player has voted on mission 
};

// Variable to hold name (and Firebase key) of game session
var globalGameName = "hej";


