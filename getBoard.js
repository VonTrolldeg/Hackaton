// Gets up board based on number of players
function getBoard(numberOfPlayers){
    /* Boards are set up as lists with five objects, one for each mission.

    Objects have five keys:
    playersRequired & failsRequired (integers)
    missionStatus (string)
    participants (list of objects with players' data)
    voteSum (integer) - is measured against failsrequired to see if mission succeeded or failed

    Board index by line:
    20. fivePlayerBoard
    58. sixPlayerBoard
    96. sevenPlayerBoard
    134. eightPlayerBoard
    172. ninePlayerBoard
    210. tenPlayerBoard
    */

    var fivePlayerBoard = [
        {
            playersRequired: 2,
            failsRequired: 1,
            missionStatus: "TBD", // alt. "Succeded" / "Failed"
            participants: [], // same objects as in "players/gameName" in firebase
            voteSum: 0 // Succeed mission = 0, fail mission = 1. If voteSum >= failsRequired -> mission fail
        },
        {
            playersRequired : 3,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 2,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 3,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 3,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        }
    ];

    var sixPlayerBoard = [
        {
            playersRequired: 2,
            failsRequired: 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 3,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 3,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        }
    ];

    var sevenPlayerBoard = [
        {
            playersRequired: 2,
            failsRequired: 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 3,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 3,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 2,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        }
    ];

    var eightPlayerBoard = [
        {
            playersRequired: 3,
            failsRequired: 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 5,
            failsRequired : 2,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 5,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        }
    ];

    var ninePlayerBoard = [
        {
            playersRequired: 3,
            failsRequired: 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 5,
            failsRequired : 2,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 5,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        }
    ];

    var tenPlayerBoard = [
        {
            playersRequired: 3,
            failsRequired: 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 4,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 5,
            failsRequired : 2,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        },
        {
            playersRequired : 5,
            failsRequired : 1,
            missionStatus: "TBD",
            participants: [],
            voteSum: 0
        }
    ];

    // Object handling all boards for easy return

    var boards = {
        //testing
        "1" : fivePlayerBoard,
        "2" : fivePlayerBoard,
        "3" : fivePlayerBoard,
        "4" : fivePlayerBoard,
        //testing
        "5" : fivePlayerBoard,
        "6" : sixPlayerBoard,
        "7" : sevenPlayerBoard,
        "8" : eightPlayerBoard,
        "9" : ninePlayerBoard,
        "10" : tenPlayerBoard
    };

    return boards[numberOfPlayers];

}
