const $loginForm = document.querySelector("#loginForm");
const $loginFormInputUserName = document.querySelector("#userNameInput");
const $loginFormInputPassword = document.querySelector("#passwordInput");
const $loginFormButton = $loginForm.querySelector("button");
const $signUpButton = document.querySelector("#signUpButton");



$loginFormButton.addEventListener("click", async (e) => {
    e.preventDefault();
    async function getUser() {
        const headers = new Headers();
        headers.append("content-type", "application/json");
        const requestOptions = {
            method: "POST",
            body: JSON.stringify({userName: $loginFormInputUserName.value, password: $loginFormInputPassword.value}),
            headers,
            credentials: "include",
            redirect: "follow"
        };
        const response = await fetch("http://localhost:3000/user/login", requestOptions);
        return response.json();
    }
    const user = await getUser();
    if(!user.user.userName) {
        return alert("User not found");
    }
    localStorage.setItem('activeUser', JSON.stringify(user.user));
    window.location.href="http://localhost:3000/loading.html";
});

$signUpButton.addEventListener("click", async (e) => {
    window.location.href="http://localhost:3000/signUp.html";
});
