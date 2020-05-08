"use strict";

const buttonCart = document.querySelector("#cart-button"),
    modal = document.querySelector(".modal"),
    buttonClose = document.querySelector(".close"),
    buttonAuth = document.querySelector(".button-auth"),
    modalAuth = document.querySelector(".modal-auth"),
    closeAuth = document.querySelector(".close-auth"),
    loginForm = document.querySelector("#loginForm"),
    loginInput = document.querySelector("#login"),
    userName = document.querySelector(".user-name"),
    buttonOut = document.querySelector(".button-out"),
    cardsRestaurants = document.querySelector(".cards-restaurants"),
    containerPromo = document.querySelector(".container-promo"),
    restaurants = document.querySelector(".restaurants"),
    menu = document.querySelector(".menu"),
    logo = document.querySelector(".logo"),
    cardsMenu = document.querySelector(".cards-menu");

let login = localStorage.getItem("deliveryLogin");

const valid = function (str) {
    const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
    return nameReg.test(str);
};

function toggleModal() {
    modal.classList.toggle("is-open");
}

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
    userName.textContent = login;
    buttonAuth.style.display = "none";
    userName.style.display = "inline";
    buttonOut.style.display = "block";
    buttonOut.addEventListener("click", logOut);
}

function notAuthorized() {
    function logIn(event) {
        event.preventDefault();

        if (valid(loginInput.value)) {
            login = loginInput.value;
            localStorage.setItem("deliveryLogin", login);
            toggleModalAuth();
            buttonAuth.removeEventListener("click", toggleModalAuth);
            closeAuth.removeEventListener("click", toggleModalAuth);
            loginForm.removeEventListener("submit", logIn);
            loginForm.reset();
            checkAuth();
        } else {
            loginInput.style.outline = "transparent";
            loginInput.style.borderColor = "red";
            loginInput.value = "";
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

function createCardRestaurants() {
    const card = `
		<a class="card card-restaurant">
			<img src="img/pizza-plus/preview.jpg" alt="image" class="card-image" />
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title">Пицца плюс</h3>
					<span class="card-tag tag">50 мин</span>
				</div>
				<div class="card-info">
					<div class="rating">
						4.5
					</div>
					<div class="price">От 900 ₽</div>
					<div class="category">Пицца</div>
				</div>
			</div>
		</a>
	`;
    cardsRestaurants.insertAdjacentHTML("beforeend", card);
}

function createCardGood() {
    const card = document.createElement("div");
    card.className = "card";
    card.insertAdjacentHTML(
        "beforeend",
        `
		<img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image" />
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">Пицца Классика</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина,
					салями,
					грибы.
				</div>
			</div>
			<div class="card-buttons">
				<button class="button button-primary button-add-cart">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price-bold">510 ₽</strong>
			</div>
		</div>
	`
    );
    cardsMenu.insertAdjacentElement("beforeend", card);
}

function openGoods(event) {
    const target = event.target,
        restaurant = target.closest(".card-restaurant");

    if (restaurant) {
        if (login) {
            cardsMenu.textContent = "";
            containerPromo.classList.add("hide");
            restaurants.classList.add("hide");
            menu.classList.remove("hide");
            createCardGood();
            createCardGood();
            createCardGood();
        } else {
            toggleModalAuth();
        }
    }
}

buttonCart.addEventListener("click", toggleModal);
buttonClose.addEventListener("click", toggleModal);
cardsRestaurants.addEventListener("click", openGoods);
logo.addEventListener("click", () => {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
});

checkAuth();
createCardRestaurants();
createCardRestaurants();
createCardRestaurants();

new Swiper(".swiper-container", {
    loop: true,
    autoplay: {
        delay: 3000,
    },
});
