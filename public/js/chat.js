const socket = io();


//
const $messageForm = document.querySelector("#messageForm");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
//
socket.on("message", (message) => {
    console.log(message);
});



// socket.emit("sendmessage", message, (message) => {
// });

$messageFormButton.addEventListener("click", (e) => {
    e.preventDefault();
    const message = $messageFormInput.value;

    if(!message) {
        return window.alert("Text cant be empty");
    }

    socket.emit("sendmessage", message, (message) => {
        $messageFormInput.value = "";
    });

})
