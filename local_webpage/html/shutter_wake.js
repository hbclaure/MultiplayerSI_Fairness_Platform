let isConnectingSW = false;  // Flag to track connection status
let shutterSW = null;

function shutterWake(){
    console.log("start")
    if (isConnectingSW) {
        console.log("Already in the process of connecting...");
        return;
    }

    isConnectingSW = true;

    if (shutterSW != null){
        shutterSW.close(); // close previous connection if exists
    };

    shutterSW = new WebSocket("ws://localhost:8282/shutter_wake");

    shutterSW.onerror = (error) => {
        console.error("Websocket error: ", error);
        if (shutterSW != null){
            console.log("closing");
            shutterSW.close(); // close previous connection if exists
            return;
        };
        setTimeout(() => {
            console.log("waiting")
            isConnectingSW = false;
            shutterWake();
        },500); // 100 milliseconds = .1 second
    };
    
    shutterSW.onopen = () => {
        console.log("shutter wake connection established");
        shutterSW.send("wake");
        console.log("sending");
    };
    
};
