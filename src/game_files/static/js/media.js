var width = 500;
var height = 0;

var recording = null;

var streaming = false;

var video = null;
var canvas = null;
var photo = null;
var image = null;
var startTimeM = new Date().getTime();
var nowTime;
var gameBlob;
var imgBlob;

function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    console.log('hi');

    if(display_vid=='on'){
        video.style.display='block'
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        // copy.srcObject = stream;
        //copy.play();
        video.srcObject = stream;
        video.play();
    })
    .catch(function(err) {
        console.log("An error occurred: " + err);
        webcam_off_error();
    });
    
    video.addEventListener('canplay', function(ev){
        if (!streaming) {

            // maintain aspect ratio
            height = video.videoHeight / (video.videoWidth/width);
            ratio = video.videoWidth/width

            video.setAttribute('width', width/2);
            video.setAttribute('height', height/2);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;

            console.log("Webcam ready, starting in a second");
            // sockets.image.send('EVENT: webcam started (canplay)', time.toTimeString(), time.getTime() - startTimeM)

            setTimeout(() => { game.scene.start('start_scene'); }, 300);
        }
    }, false);

    video.addEventListener('ended', function(ev){
        let time = new Date()
        console.log('EVENT: webcam ended', time.toTimeString(), time.getTime() - startTimeM);
        sockets.image.send('EVENT: webcam ended', time.toTimeString(), time.getTime() - startTimeM)
        sockets.game.send('EVENT: webcam ended', time.toTimeString(), time.getTime() - startTimeM)
    }, false);

    video.addEventListener('suspend', function(ev){
        let time = new Date();
        console.log('EVENT: webcam suspended', time.toTimeString(), time.getTime() - startTimeM);
        sockets.image.send('EVENT: webcam suspended', time.toTimeString(), time.getTime() - startTimeM)
        sockets.game.send('EVENT: webcam suspended', time.toTimeString(), time.getTime() - startTimeM)
    }, false);
    //save_image_loop()
}

function webcam_off_error(){
    canvas.style.display='block';
    var ctx2 = canvas.getContext('2d');
    ctx2.beginPath();
    ctx2.fillStyle="red";
    ctx2.font = "15pt sans-serif";
    ctx2.fillText("ERROR: PLEASE ENABLE", 20, 50);
    ctx2.fillText("YOUR WEBCAM", 20, 75);
}

var startTime;
function save_image_loop(stage=1) {
    startTime = new Date().getTime();
    recording = setTimeout(function record(id=recording){
        nowTime = new Date().getTime();
        let millis_to_pass = nowTime - startTimeM;
        logpicture(stage, frame_number, millis_to_pass);
        // loggame(stage, frame_number, millis_to_pass);
        if ((stage==2 || stage==0) && new Date().getTime() - startTime >= 10000) {
            // clearInterval(recording);
            console.log('stopped recording');
        } else if (id != recording) {
            console.log('new stage. stopped recording', id)
        } else {
            // console.log(recording)
            setTimeout(record, 66, id);
        }
    }, 66);
}

// log user video frame
function logpicture(stage=1,current_frame_number,current_millis) {
    // stage 0: start, 1: in-game, 2: end
    if (width && height){
        let context = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        nowTime = new Date().getTime();

        let millis_g = nowTime - startTimeM;
        game.canvas.toBlob(function(blob) {
            gameBlob = new Blob([current_frame_number,'z',stage,'y',millis_g,'w',current_millis,blob]);
            sockets.game.send(gameBlob);
        }, 'image/jpeg',0.1);

        let millis_p = nowTime - startTimeM;
        //sockets.image.send(JSON.stringify({'img':canvas.toDataURL('image/jpeg'),'frame_number':frame_number,'stage':stage,'millis':millis}))
        canvas.toBlob(function(blob) {
            imgBlob = new Blob([current_frame_number,'z',stage,'y',millis_p,'w',current_millis,blob]);
            sockets.image.send(imgBlob);
        },'image/jpeg');
    }
}

// record game frames
// function loggame(stage=1, current_frame_number,current_millis) {
//     //sockets.game.send(JSON.stringify({'img':game.canvas.toDataURL('image/jpeg',0.1),'frame_number':frame_number}))
//     nowTime = new Date().getTime();
//     let millis_g = nowTime - startTimeM;
//     game.canvas.toBlob(function(blob) {
//         gameBlob = new Blob([current_frame_number,'z',stage,'y',millis_g,'w',current_millis,blob]);
//         sockets.game.send(gameBlob);
//     }, 'image/jpeg',0.1);
// }


window.addEventListener('load', startup, false);