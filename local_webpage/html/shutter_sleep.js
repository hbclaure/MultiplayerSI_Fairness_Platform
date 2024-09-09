let isConnectingSS = false;  // Flag to track connection status
let shutterSS = null;

function shutterSleep(){
    if (isConnectingSS) {
        console.log("Already in the process of connecting...");
        return;
    }

    isConnectingSS = true;

    if (shutterSS != null){
        shutterSS.close(); // close previous connection if exists
    };

    shutterSS = new WebSocket("ws://127.0.0.1:8282/shutter_sleep");
    
    shutterSS.onerror = (error) => {
        console.error("Websocket error: ", error);
        if (shutterSS != null){
            console.log("closing");
            shutterSS.close(); // close previous connection if exists
            return;
        };
        setTimeout(() => {
            console.log("waiting");
            isConnectingSS = false;
            shutterSleep();
            //shutter = new WebSocket("ws://127.0.0.1:8282/shutter_sleep");
        },500); // 100 milliseconds = .1 second
    };
    shutterSS.onopen = () => {
        console.log("shutter sleep connection established");
        shutterSS.send("sleep");
    };

};