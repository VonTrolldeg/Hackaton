
/*
ALL Lobal variables!
*/

//link to firebase
var baseurl = "https://resistancehonken.firebaseio.com/";

//referense to the main  repository
var resistenceRef = new Firebase(baseurl);

//making glboal variables of the buttons
var createGame = $('#create-game'),
    joinGame = $('#join-game'),
    submitGame = $('#submit-game'),
    startGame = $('#start-game')
    showRole = $('#showRole'),
    hideRole = $('#hideRole'),
    nominate = $('#nominate'),
    reject = $('#reject'),
    approve = $('#approve'),
    orderDone =$('#orderDone'),
    player = $('.player');

//global varable with all the players in the lobby
var lobbyPlayerList = $('#lobby-players');
//global variable with all the players in the game. Will be shown in the core loop
var playerList = $('#playerList');

//global varables for the state of the game

var user = { name: "", id: "", role: ""};
//game = undefined?
var game;
//gameID = Name of the game
var gameID;
// global variable for the perosn starting the game
var startingGame = false;
//missionLeader = One player get to be Missionleader.
var missionLeader;
//One variabel to test the function getNextMissionLeader(gameName, missionleader).
var i = 0;
// Game board for game, a list with five objects (one/mission)
var gameBoard = [];
