const $chats = document.querySelector("#chats");
const chatsTemplate = document.querySelector('#chatsTemplate').innerHTML;


async function getUser() {
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
    await getUser();
})();
