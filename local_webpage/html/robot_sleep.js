let isConnectingRS = false;  // Flag to track connection status
let robotRS = null;

function robotSleep(){
    if (isConnectingRS) {
        console.log("Already in the process of connecting...");
        return;
    }

    isConnectingRS = true;

    if (robotRS != null){
        robotRS.close(); // close previous connection if exists
    };

    robotRS = new WebSocket("ws://127.0.0.1:8282/robot_sleep");
    robotRS.onerror = (error) => {
        console.error("Websocket error: ", error);
        if (robotRS != null){
            console.log("closing");
            robotRS.close(); // close previous connection if exists
            return;
        };
        setTimeout(() => {
            console.log("waiting");
            isConnectingRS = false;
            robotSleep();
        },500); // 100 milliseconds = .1 second
    };
    robotRS.onopen = () => {
        console.log("robot sleep connection established");
        robotRS.send("sleep");
    };
};