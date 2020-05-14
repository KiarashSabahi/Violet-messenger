const socket = io();
const reciever = sessionStorage.getItem("userName");
const kind = sessionStorage.getItem("kind");

// const $messageForm = document.querySelector("#messageForm");
const $messageFormInput = document.querySelector("#messageInput");
const $messageFormButton = document.querySelector("#messageSendButton");
const $messages = document.querySelector("#messages");
// const messageTemplate = document.querySelector('#messageTemplate').innerHTML;

let chatId = "";

document.querySelector("#chatContact_name").innerHTML = reciever

function render(message, sender, time) {
    var node = document.createElement("div");
    var textnode = document.createTextNode(sender + " at " + time + " : " + message);
    node.classList.add("message");
    node.appendChild(textnode);
    document.querySelector("#messages").appendChild(node);
    document.querySelector(".middle").scrollTo(0,document.querySelector(".middle").scrollHeight);
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
    const chat = await response.json();
    chat.messages.forEach((message) => {
        let time = new Date(message.submitTime)
        render(message.message, message.sender, time.toLocaleTimeString());
    });

    // document.getElementById("titleBar").innerHTML = chat.name;
})();

//

//
socket.on("message", ({message, user, reciever}) => {
    render(message, user, new Date().toLocaleTimeString());
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
