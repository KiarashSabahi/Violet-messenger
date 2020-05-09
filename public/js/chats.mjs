const socket = io();

const $chats = document.querySelector("#chats");
const chatsTemplate = document.querySelector('#chatsTemplate').innerHTML;
const $chatSelectForm = document.querySelector("#chatSelectForm");
const $chatSelectFormInput = $chatSelectForm.querySelector("input");
const $chatSelectFormButton = $chatSelectForm.querySelector("button");

async function getUsers() {
    const headers = new Headers();
    const requestOptions = {
        method: "GET",
        headers,
        redirect: "follow"
    };
    const response = await fetch("http://localhost:3000/chats", requestOptions);
    const chats = await response.json();

    chats.forEach((item) => {
        const html = Mustache.render(chatsTemplate, {
            userName: item.userName
        });


        $chats.insertAdjacentHTML("beforeend", html);
    });

}

;(async () => {
    await getUsers();
})();


$chatSelectFormButton.addEventListener("click", (e) => {
    e.preventDefault();

    let user = $chatSelectFormInput.value;

    if(!user) {
        return window.alert("Username cant be empty");
    }
    async function getUser() {
        // const headers = new Headers();
        // headers.append("content-type", "application/json");
        // const requestOptions = {
        //     method: "POST",
        //     headers,
        //     redirect: "follow",
        //     body: JSON.stringify({userName: user})
        // };
        // const response = await fetch("http://localhost:3000/direct", requestOptions);
        // const chat = await response.json();


        sessionStorage.setItem("userName", user);

        window.location.href="http://localhost:3000/chat.html";
    }

    ;(async () => {
        await getUser();
    })();

});
