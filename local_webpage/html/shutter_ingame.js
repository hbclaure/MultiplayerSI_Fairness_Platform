let isConnectingSI = false;  // Flag to track connection status
let shutterSI = null;

function shutterIngame(){
    if (isConnectingSI) {
        console.log("Already in the process of connecting...");
        return;
    }

    isConnectingSI = true;

    if (shutterSI != null){
        shutterSI.close(); // close previous connection if exists
    };

    shutterSI = new WebSocket("ws://127.0.0.1:8282/shutter_ingame");
    
    shutterSI.onerror = (error) => {
        console.error("Websocket error: ", error);
        if (shutterSI != null){
            console.log("closing");
            shutterSI.close(); // close previous connection if exists
            return;
        };
        setTimeout(() => {
            console.log("waiting");
            isConnectingSI = false;
            shutterIngame();
        },500); // 100 milliseconds = .1 second
    };
    shutterSI.onopen = () => {
        console.log("shutter ingame connection established");
        shutterSI.send("in_game");
    };
};
