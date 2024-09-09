let isConnectingRW = false;  // Flag to track connection status
let robotRW = null;

function robotWake(){
    if (isConnectingRW) {
        console.log("Already in the process of connecting...");
        return;
    }

    isConnectingRW = true;

    if (robotRW != null){
        robotRW.close(); // close previous connection if exists
    };

    robotRW = new WebSocket("ws://127.0.0.1:8282/robot_wake");
    robotRW.onerror = (error) => {
        console.error("Websocket error: ", error);
        if (robotRW != null){
            console.log("closing");
            robotRW.close(); // close previous connection if exists
            return;
        };
        setTimeout(() => {
            console.log("waiting");
            isConnectingRW = false;
            robotWake();
        },500); // 100 milliseconds = .1 second
    };
    robotRW.onopen = () => {
        console.log("robot wake connection established");
        robotRW.send("wake");
    };
};