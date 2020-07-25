const $signUpForm = document.querySelector("#signUpForm");
const $signUpFormInputUserName = document.querySelector("#userNameInput");
const $signUpFormInputNickname = document.querySelector("#nickNameInput");
const $signUpFormInputPassword = document.querySelector("#passwordInput");
const $signUpFormInputEmail = document.querySelector("#emailInput");

const $signUpFormButton = $signUpForm.querySelector("button");
const $signUpButton = document.querySelector("#signUpButton");



$signUpFormButton.addEventListener("click", async (e) => {
    e.preventDefault();
    async function getUser() {
        const headers = new Headers();
        headers.append("content-type", "application/json");
        const requestOptions = {
            method: "POST",
            body: JSON.stringify({userName: $signUpFormInputUserName.value, nickName: $signUpFormInputNickname.value, email: $signUpFormInputEmail.value, password: $signUpFormInputPassword.value}),
            headers,
            credentials: "include",
            redirect: "follow"
        };
        const response = await fetch("http://localhost:3000/user/signup", requestOptions);
        return response.json();
    }
    const answer = await getUser();
    try {
        if (answer.errmsg) {
            if(answer.errmsg.includes("duplicate ")) {
                return alert("user already exist");
            } else if(answer.name === "MongoError"){
                return alert("user already exist");
            }
        }
    } catch (e) {
        console.log(e)
    }
    try {
        localStorage.setItem('activeUser', JSON.stringify(answer.user));
        window.location.href="http://localhost:3000/loading.html";
    } catch (e) {
        console.log(e)
    }
});
