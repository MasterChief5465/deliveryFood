"use strict";

const buttonCart = document.querySelector("#cart-button"),
    modal = document.querySelector(".modal"),
    buttonClose = document.querySelector(".close");

function toggleModal() {
    modal.classList.toggle("is-open");
}
buttonCart.addEventListener("click", toggleModal);
buttonClose.addEventListener("click", toggleModal);

// Day 1

const buttonAuth = document.querySelector(".button-auth"),
    modalAuth = document.querySelector(".modal-auth"),
    closeAuth = document.querySelector(".close-auth"),
    loginForm = document.querySelector("#loginForm"),
    loginInput = document.querySelector("#login"),
    userName = document.querySelector(".user-name"),
    buttonOut = document.querySelector(".button-out");

let login = localStorage.getItem("deliveryLogin");

function toggleModalAuth() {
    loginInput.style.borderColor = "";
    modalAuth.classList.toggle("is-open");
}

function authorized() {
    function logOut() {
        login = null;
        buttonAuth.style.display = "";
        userName.style.display = "";
        buttonOut.style.display = "";
        buttonOut.removeEventListener("click", logOut);
        localStorage.removeItem("deliveryLogin");
        checkAuth();
    }
    console.log("authorized");

    userName.textContent = login;
    buttonAuth.style.display = "none";
    userName.style.display = "inline";
    buttonOut.style.display = "block";
    buttonOut.addEventListener("click", logOut);
}

function notAuthorized() {
    console.log("not authorized");

    function logIn(event) {
        event.preventDefault();

        if (loginInput.value.trim()) {
            login = loginInput.value;
            localStorage.setItem("deliveryLogin", login);
            toggleModalAuth();
            buttonAuth.removeEventListener("click", toggleModalAuth);
            closeAuth.removeEventListener("click", toggleModalAuth);
            loginForm.removeEventListener("submit", logIn);
            loginForm.reset();
            checkAuth();
        } else {
            loginInput.style.borderColor = "red";
        }
    }
    buttonAuth.addEventListener("click", toggleModalAuth);
    closeAuth.addEventListener("click", toggleModalAuth);
    loginForm.addEventListener("submit", logIn);
}

function checkAuth() {
    if (login) {
        authorized();
    } else {
        notAuthorized();
    }
}
checkAuth();
