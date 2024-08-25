// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers");

const Lobby = require('./lobby');


const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;


const lobby = new Lobby();

let playerState = {};





function hex2str(hex) {
  return ethers.toUtf8String(hex);
}


function str2hex(payload) {
  return ethers.hexlify(ethers.toUtf8Bytes(payload));
}


async function report(payload) {
  let data = payload;
  if (payload === null || payload === undefined) {
    data = "null"
  }
  const report_req = await fetch(rollup_server + "/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: str2hex(data) }),
  });
  console.log("Received finish status " + report_req);
}


async function notify(payload) {
  let data = payload;
  if (payload === null || payload === undefined) {
    data = "null"
  }
  const notice_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: str2hex(data) }),
  });
  console.log("Received finish status " + notice_req);
}



async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  const metadata = data["metadata"];
  const sender = metadata["msg_sender"];
  const hexPayload = data["payload"];

  let payload = JSON.parse(JSON.parse(hex2str(hexPayload)));


  const state = payload["method"];
  const request = payload["request"];
  const method = handleAdvance[state];

  if (!method) {
    report("invalid method");
    return "reject";
  }
  return method(sender, request);

}


async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));

  const hexPayload = data["payload"];
  const state = hex2str(hexPayload);
  const method = handleInspect[state];

  if (!method) {
    report("invalid method");
    return "reject";
  }

  return method();


}


async function HomeMenu() {
  const menu = {
    1: "Create Game Room",
    2: "Join Random Game Room",
    3: "Exit",
  }
  // await notify(JSON.stringify(menu));
  const report_req = await request(JSON.stringify(menu))
  console.log(`${report_req}`)
}



async function menuOption(sender, option) {

  switch (Number(option)) {
    case 1: {
      let game = lobby.createGame(sender);
      playerState[sender] = game;


    }
      break;
    case 2:

      let game = lobby.joinGame(sender);
      if (game) {

        playerState[sender] = game;

      }


      break;
    case 3:
      try {
        delete playerState[sender];

      } catch {
        try {

          playerState[sender] = null;
        } catch {
          notify("Error has occured");
        }
      }
      notify("Exited");
      break;
    default:
      report("Invalid choice. Try again.");

  }
}



// guide to set player fleet, so i am using this for testing

//  [
//   { startX: 0, startY: 1, direction: 'H' },//battleship 1
//   { startX: 4, startY: 10, direction: 'H' },//battleship 2
//   { startX: 6, startY: 6, direction: 'V' },//submarine
//   { startX: 8, startY: 8, direction: 'V' },//destroyer
//   { startX: 0, startY: 6, direction: 'V' },//patrolBoat,
//   { startX: 10, startY: 0, direction: 'V' },//patrolBoat,
//   { startX: 4, startY: 4, direction: 'V' },//patrolBoat,
//   { startX: 8, startY: 1, direction: 'V' },//crusier,
//   { startX: 2, startY: 7, direction: 'H' },//crusier,
// ];

// pass this for test 
//"{\"method\":\"setPlayerFleet\",\"request\":[{\"startX\":0,\"startY\":1,\"direction\":\"H\"},{\"startX\":4,\"startY\":10,\"direction\":\"H\"},{\"startX\":6,\"startY\":6,\"direction\":\"V\"},{\"startX\":8,\"startY\":8,\"direction\":\"V\"},{\"startX\":0,\"startY\":6,\"direction\":\"V\"},{\"startX\":10,\"startY\":0,\"direction\":\"V\"},{\"startX\":4,\"startY\":4,\"direction\":\"V\"},{\"startX\":8,\"startY\":1,\"direction\":\"V\"},{\"startX\":2,\"startY\":7,\"direction\":\"H\"}]}"
async function setPlayerFleet(sender, request) {
  let game = playerState[sender];
  let position = request;
  if (game) {
    if (game.player2 == null) {
      report("Waiting for player ........");
      return;
    }
    if (game.gameEnded) {
      report("game has ended");
      return;
    }

    if (game.gameStarted) {
      report("you can not modify")
      return;
    }





    if (game.getPlayerReady(sender)) {

      report("you can not set a fleet, fleet has been set")
      return;
    }


    if (game.getPlayer1id() === sender) {
      game.setPlayerFleet(game.player1, position);

      return;
    }
    game.setPlayerFleet(game.player2, position);





  } else {
    report("create or join a game");
  }
}
//request = [x,y] pls note not in json
async function makeAMove(sender, request) {
  let game = playerState[sender];
  let [x, y] = request;
  if (game) {
    if (game.player2 == null) {

      notify("Waiting for player ........");
      return;
    }
    if (game.gameEnded) {

      report("game has ended");
      return;
    }
    if (!game.getPlayerReady(sender)) {

      report("fleet has not been set")
      return;
    }
    game.playTurn(x, y, sender);

  } else {
    report("create or join a game");
  }

}


async function listGames() {
  lobby.listGames();
}

async function getNews(sender, request) {
  let game = playerState[sender];

  if (game) {
    if (game.player2 == null) {
      notify("Waiting for player ........");
      return;
    }

    game.getNews();
  } else {
    report("create or join a game");
  }

}


async function getFleet(sender, request) {
  let game = playerState[sender];

  if (game) {
    if (game.player2 == null) {
      notify("Waiting for player ........");
      return;
    }

    game.getFleet(sender);
  } else {
    report("create or join a game");
  }
}

async function getGrid(sender, request) {
  let game = playerState[sender];

  if (game) {
    if (game.player2 == null) {
      notify("Waiting for player ........");
      return;
    }

    game.getGrid(sender);
  } else {
    report("create or join a game");
  }

}



async function getMyShots(sender, request) {
  let game = playerState[sender];

  if (game) {
    if (game.player2 == null) {
      notify("Waiting for player ........");
      return;
    }

    game.getMyShots(sender);
  } else {
    report("create or join a game");
  }
}


async function getOpponentShot(sender, request) {
  let game = playerState[sender];

  if (game) {
    if (game.player2 == null) {
      notify("Waiting for player ........");
      return;
    }

    game.getMyShots(sender);
  } else {
    report("create or join a game");
  }
}


async function getDefaultFleet(sender, request) {
  const FLEET_CONFIGURATION = {
    battleship: { name: 'Battleship', length: 4, quantity: 2 },
    submarine: { name: 'Submarine', length: 3, quantity: 1 },
    destroyer: { name: 'Destroyer', length: 2, quantity: 1 },
    patrolBoat: { name: 'Patrol Boat', length: 1, quantity: 3 },
    crusier: { name: 'Crusier', length: 3, quantity: 2 },
    gridSize: "11 X 11"
  };

  notify(JSON.stringify(FLEET_CONFIGURATION))

}
var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var handleInspect = {
  "HomeMenu": HomeMenu,
  "listGames": listGames,



}

var handleAdvance = {
  "menuOption": menuOption,
  "setPlayerFleet": setPlayerFleet,
  "play": makeAMove,
  "getNews": getNews,
  "getFleet": getFleet,
  "getGrid": getGrid,
  "getMyShots": getMyShots,
  "getOpponentShot": getOpponentShot,
  "getDefaultFleet": getDefaultFleet,
}


var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
