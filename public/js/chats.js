const $chats = document.querySelector("#chats");
const chatsTemplate = document.querySelector('#chatsTemplate').innerHTML;

const $newChatForm = document.querySelector("#newChatForm");
const $newChatFormInputUserName = document.querySelector("#newChatInput");
const $newChatFormButton = $newChatForm.querySelector("button");

$newChatFormButton.addEventListener("click", async (e) => {
    e.preventDefault();
    async function getChat() {
        const headers = new Headers();
        headers.append("content-type", "application/json");
        const requestOptions = {
            method: "POST",
            body: JSON.stringify({userName: $newChatFormInputUserName.value}),
            headers,
            credentials: "include",
            redirect: "follow"
        };
        const response = await fetch("http://localhost:3000/direct", requestOptions);
        return await response.json();
    }
    const response = await getChat();
    if (!response.chatId) {
        alert("error");
    }




    sessionStorage.setItem("userName", response.userName);
    sessionStorage.setItem("kind", response.kind);
    window.location.href="http://localhost:3000/chat.html";
})

async function getUsers() {
    const headers = new Headers();
    const requestOptions = {
        method: "GET",
        headers,
        redirect: "follow"
    };
    const response = await fetch("http://localhost:3000/chats", requestOptions);
    const chats = await response.json();

    chats.forEach((item, i) => {
        const html = Mustache.render(chatsTemplate, {
            userName: item.userName
        });

        const buttonTemplate =  `<button type="button" name="button" id="${i}">${item.userName}</button>`


        $chats.insertAdjacentHTML("beforeend", buttonTemplate);

        const newButton = document.getElementById(i);

        newButton.addEventListener("click", () => {
            sessionStorage.setItem("userName", item.userName);
            sessionStorage.setItem("kind", item.kind);
            window.location.href="http://localhost:3000/chat.html";
        })
    });
}



;(async () => {
    await getUsers();
})();


