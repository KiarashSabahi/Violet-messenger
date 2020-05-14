const $chats = document.querySelector("#chats");
const chatsTemplate = document.querySelector('#chatsTemplate').innerHTML;

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
