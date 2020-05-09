const socket = io();
const reciever = sessionStorage.getItem("userName");

let chatId = "";

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

;(async () => {
    const headers = new Headers();
    headers.append("content-type", "application/json");
    const requestOptions = {
        method: "POST",
        headers,
        redirect: "follow",
        body: JSON.stringify({userName: reciever})
    };
    const response = await fetch("http://localhost:3000/direct", requestOptions);
    chatId = await response.json();
    chatId = chatId.chatId;

    let cookies = getCookie("Authorization").replace("Bearer%20", "");

    socket.emit("cookies", cookies, reciever, chatId);

})();

//
const $messageForm = document.querySelector("#messageForm");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $messages = document.querySelector("#messages");
//
const messageTemplate = document.querySelector('#messageTemplate').innerHTML;
//
socket.on("message", ({message, user, reciever}) => {
    const html = Mustache.render(messageTemplate, {
        message: message,
        reciever: reciever,
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

    const user = getCookie("Sender");
    socket.emit("sendmessage", {message, user, reciever, chatId});
    $messageFormInput.value = "";
});
