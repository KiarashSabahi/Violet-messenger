function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

setTimeout(() => {
    async function getUser() {
        const headers = new Headers();
        const requestOptions = {
            method: "GET",
            headers,
            redirect: "follow"
        };
        const response = await fetch("http://localhost:3000/user/isloggedin", requestOptions);
        const user = await response.json();
        if(!user.result) {
            return window.location.href="http://localhost:3000/login.html";
        } else {
            return window.location.href="http://localhost:3000/chats.html";
        }

    }

    ;(async () => {
        await getUser();
    })();

}, 2)
