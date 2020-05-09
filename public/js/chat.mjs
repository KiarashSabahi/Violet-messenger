const socket = io();
const reciever = sessionStorage.getItem("userName");
const kind = sessionStorage.getItem("kind");

const $messageForm = document.querySelector("#messageForm");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $messages = document.querySelector("#messages");
//
const messageTemplate = document.querySelector('#messageTemplate').innerHTML;

let chatId = "";

function render(message, reciever, user) {
    const html = Mustache.render(messageTemplate, {
        message: message,
        reciever: reciever,
        user: user
    });
    $messages.insertAdjacentHTML("beforeend", html);
    window.scrollTo(0,document.body.scrollHeight);
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

;(async () => {
    const headers = new Headers();
    headers.append("content-type", "application/json");
    let requestOptions = {
        method: "POST",
        headers,
        redirect: "follow",
        body: JSON.stringify({userName: reciever})
    };
    let response = await fetch("http://localhost:3000/" + kind, requestOptions);
    chatId = await response.json();
    chatId = chatId.chatId;
    let cookies = getCookie("Authorization").replace("Bearer%20", "");

    socket.emit("cookies", cookies, reciever, chatId);

    requestOptions = {
        method: "POST",
        headers,
        redirect: "follow",
        body: JSON.stringify({chatId, kind})
    };
    response = await fetch("http://localhost:3000/messages", requestOptions);
    const messages = await response.json();
    console.log(messages);
    messages.forEach((message) => {
        render(message.message, message.reciever, message.sender);
    });
})();

//

//
socket.on("message", ({message, user, reciever}) => {
    render(message, reciever, user);
});
//
$messageFormButton.addEventListener("click", (e) => {
    e.preventDefault();
    const message = $messageFormInput.value;

    if(!message) {
        return window.alert("Text cant be empty");
    }

    const user = getCookie("Sender");
    socket.emit("sendmessage", {message, user, reciever, chatId, kind});
    $messageFormInput.value = "";
});
