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
            body: JSON.stringify({userName: $loginFormInputUserName.value, password: $loginFormInputPassword.value}),
            headers,
            credentials: "include",
            redirect: "follow"
        };
        const response = await fetch("http://localhost:3000/user/login", requestOptions);
        return response.json();
    }
    const user = await getUser();
    localStorage.setItem('activeUser', JSON.stringify(user.user));
    if(!user) {
        return window.alert("User not found");
    }
    window.location.href="http://localhost:3000/loading.html";
});
