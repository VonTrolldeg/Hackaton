
/*
ALL Lobal variables!
*/

//link to firebase
var baseurl = "https://asres.firebaseio.com/";

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
    orderDone = $('#orderDone'),
    success = $('#success'),
    fail = $('#fail'),
    startMission = $('#startMission'),
    player = $('.player'),
    leftArrow = $('#arrowLeft'),
    rightArrow = $('#arrowRight'),
    nextMission = $('#nextMission'),
    missionAgendaCards = $('#missionAgendaCards')
    restartNomination = $('#restartNomination')

//global varable with all the players in the lobby
var lobbyPlayerList = $('#lobby-players');
//global variable with all the players in the game. Will be shown in the core loop
var playerList = $('#playerList');
//list with all players and what they voted on the nominated team
var votesAndNames = $('#votesAndNames');

//global varables for the state of the game

var user = { name: "", id: "", role: "", missionleader: false};
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
var gameBoard;
// current mission
var currentMission = 0;
// vote Tracker
var voteTracker = 0;

var nominatedPlayers = [];
