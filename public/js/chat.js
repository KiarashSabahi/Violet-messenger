const socket = io();
//
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

let cookies = getCookie("Authorization").replace("Bearer%20", "");

socket.emit("cookies", cookies);

//
const $messageForm = document.querySelector("#messageForm");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $messages = document.querySelector("#messages");
//
const messageTemplate = document.querySelector('#messageTemplate').innerHTML;
//
socket.on("message", (user, message) => {
    const html = Mustache.render(messageTemplate, {
        message: message,
        user: user
    });

    $messages.insertAdjacentHTML("beforeend", html);
});
//
$messageFormButton.addEventListener("click", (e) => {
    e.preventDefault();
    const message = $messageFormInput.value;

    if(!message) {
        return window.alert("Text cant be empty");
    }

    socket.emit("sendmessage", message);
    $messageFormInput.value = "";
});
