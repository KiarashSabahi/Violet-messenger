const $loginForm = document.querySelector("#loginForm");
const $loginFormInputUserName = document.querySelector("#userNameInput");
const $loginFormInputPassword = document.querySelector("#passwordInput");
const $loginFormButton = $loginForm.querySelector("button");


$loginFormButton.addEventListener("click", async (e) => {
    e.preventDefault();
    async function getUser() {
        const headers = new Headers();
        headers.append("content-type", "application/json");
        const requestOptions = {
            method: "POST",
            body: JSON.stringify({email: $loginFormInputUserName.value, password: $loginFormInputPassword.value}),
            headers,
            credentials: "include",
            redirect: "follow"
        };
        const response = await fetch("http://localhost:3000/user/login", requestOptions);
        return response.json();
    }
    const user = await getUser();
    if(!user) {
        return window.alert("User not found");
    }
    console.log(user);
    window.location.href="http://localhost:3000/chat.html";
});
