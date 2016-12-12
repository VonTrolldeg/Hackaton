// Sets up board based on number of players
function getBoard(numberOfPlayers){
    /* Boards are set up as lists with five objects, one for each mission.

    Objects have five keys:
    playersRequired & failsRequired (integers)
    missionStatus (string)
    agendas (integer) - iterated when player's have chosen agenda, measured against playersRequired
        to see when mission is complete
    failSum (integer) - is measured against failsrequired to see if mission succeeded or failed

    Board index by line:
    21. fivePlayerBoard
    59. sixPlayerBoard
    97. sevenPlayerBoard
    135. eightPlayerBoard
    173. ninePlayerBoard
    211. tenPlayerBoard
    */

    var fivePlayerBoard = [
        {
            playersRequired: 2, // Players required for mission
            failsRequired: 1, // Fails required to fail mission
            missionStatus: "TBD", // alt. "Succeded" / "Failed"
            agendas: 0, // players choice of fail/success
            failSum: 0 // Succeed mission = 0, fail mission = 1. If failSum >= failsRequired -> mission fail
        },
        {
            playersRequired : 3,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 2,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 3,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 3,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        }
    ];

    var sixPlayerBoard = [
        {
            playersRequired: 2,
            failsRequired: 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 3,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 3,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        }
    ];

    var sevenPlayerBoard = [
        {
            playersRequired: 2,
            failsRequired: 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 3,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 3,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 2,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        }
    ];

    var eightPlayerBoard = [
        {
            playersRequired: 3,
            failsRequired: 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 5,
            failsRequired : 2,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 5,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        }
    ];

    var ninePlayerBoard = [
        {
            playersRequired: 3,
            failsRequired: 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 5,
            failsRequired : 2,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 5,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        }
    ];

    var tenPlayerBoard = [
        {
            playersRequired: 3,
            failsRequired: 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 5,
            failsRequired : 2,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        },
        {
            playersRequired : 5,
            failsRequired : 1,
            missionStatus: "TBD",
            agendas: 0,
            failSum: 0
        }
    ];

    // Object handling all boards for easy return

    var boards = {
        // Testing boards below
        "1" : fivePlayerBoard,
        "2" : fivePlayerBoard,
        "3" : fivePlayerBoard,
        "4" : fivePlayerBoard,
        // Real boards below
        "5" : fivePlayerBoard,
        "6" : sixPlayerBoard,
        "7" : sevenPlayerBoard,
        "8" : eightPlayerBoard,
        "9" : ninePlayerBoard,
        "10" : tenPlayerBoard
    };
    
    return boards[numberOfPlayers];

}
