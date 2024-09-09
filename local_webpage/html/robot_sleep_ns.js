let isConnectingRSNS = false;  // Flag to track connection status
let robotRSNS = null;

console.log("NS");

function robotSleepNS(){
    if (isConnectingRSNS) {
        console.log("Already in the process of connecting...");
        return;
    }

    isConnectingRSNS = true;

    if (robotRSNS != null){
        robotRSNS.close(); // close previous connection if exists
    };

    robotRSNS = new WebSocket("ws://127.0.0.1:8282/robot_sleep_ns");
    robotRSNS.onerror = (error) => {
        console.error("Websocket error: ", error);
        if (robotRSNS != null){
            console.log("closing");
            robotRSNS.close(); // close previous connection if exists
            return;
        };
        setTimeout(() => {
            console.log("waiting");
            isConnectingRSNS = false;
            robotSleepNS();
        },500); // 100 milliseconds = .1 second
    };
    robotRSNS.onopen = () => {
        console.log("robot sleep connection established");
        robotRSNS.send("sleep");
    };
};