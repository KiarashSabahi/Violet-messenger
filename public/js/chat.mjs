const socket = io();
const reciever = sessionStorage.getItem("userName");
const kind = sessionStorage.getItem("kind");
var messageNumber;

var activeUser = localStorage.getItem("activeUser");
activeUser = JSON.parse(activeUser);
activeUser = activeUser.userName;

const $messageFormInput = document.querySelector("#messageInput");
const $messageFormButton = document.querySelector("#messageSendButton");
const $messages = document.querySelector("#messages");

let chatId = "";

document.querySelector("#chatContact_name").innerHTML = reciever

function render(message, sender, time, count) {
    var node = document.createElement("div");

    var senderNode = document.createElement("div");
    if (sender == activeUser) {
        senderNode.classList.add("sendMessages");
    } else {
        senderNode.classList.add("recievedMessages");
    }
    var senderText = document.createTextNode(sender);
    senderNode.appendChild(senderText);

    var messageNode = document.createElement("div");
    var messageText = document.createTextNode(message);
    messageNode.appendChild(messageText);

    var timeNode = document.createElement("div");
    var timeText = document.createTextNode(time);
    timeNode.appendChild(timeText);

    node.classList.add("message");

    if(sender == activeUser) {
        node.classList.add("sent");
        timeNode.classList.add("sentMessageTime");
    } else {
        node.classList.add("recieved");
        timeNode.classList.add("recievedMessageTime");
    }

    node.appendChild(senderNode);
    node.appendChild(messageNode);
    node.appendChild(timeNode);
    node.id = count;

    document.querySelector("#messages").appendChild(node);
    document.querySelector(".middle").scrollTo(0,document.querySelector(".middle").scrollHeight);
}


function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

//main function
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


    socket.emit("addSocketID", reciever, chatId);

    requestOptions = {
        method: "POST",
        headers,
        redirect: "follow",
        body: JSON.stringify({chatId, kind})
    };
    response = await fetch("http://localhost:3000/messages", requestOptions);
    const chat = await response.json();
    let count = 0;
    chat.messages.forEach((message) => {
        let time = new Date(message.submitTime)
        render(message.message, message.sender, time.toLocaleTimeString(), count);
        count++;
    });
    messageNumber = count;

})();

//
socket.on("message", ({message, user, reciever}) => {
    render(message, user, new Date().toLocaleTimeString(), messageNumber);
    messageNumber++ ;
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
