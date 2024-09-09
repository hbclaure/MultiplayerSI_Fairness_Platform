let isConnectingRI = false;  // Flag to track connection status
let robotRI = null;

function robotIntro(){
    console.log("intro")
    if (isConnectingRI) {
        console.log("Already in the process of connecting...");
        return;
    }

    isConnectingRI = true;
    
    if (robotRI != null){
        robotRI.close(); // close previous connection if exists
    };

    robotRI = new WebSocket("ws://127.0.0.1:8282/robot_introduction");
    
    robotRI.onerror = (error) => {
        console.error("Websocket error: ", error);
        if (robotRI != null){
            console.log("closing");
            robotRI.close(); // close previous connection if exists
            return;
        };
        setTimeout(() => {
            console.log("waiting");
            isConnectingRI = false;
            robotIntro();
        },500); // 100 milliseconds = .1 second
    };
    robotRI.onopen = () => {
        console.log("robot intro connection established");
        robotRI.send("intro");
        console.log("intro sent");
    };
};