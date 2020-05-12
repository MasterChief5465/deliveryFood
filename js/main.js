'use strict';

const buttonCart = document.querySelector('#cart-button'),
	modal = document.querySelector('.modal'),
	buttonClose = document.querySelector('.close'),
	buttonAuth = document.querySelector('.button-auth'),
	modalAuth = document.querySelector('.modal-auth'),
	closeAuth = document.querySelector('.close-auth'),
	loginForm = document.querySelector('#loginForm'),
	loginInput = document.querySelector('#login'),
	userName = document.querySelector('.user-name'),
	buttonOut = document.querySelector('.button-out'),
	cardsRestaurants = document.querySelector('.cards-restaurants'),
	containerPromo = document.querySelector('.container-promo'),
	restaurants = document.querySelector('.restaurants'),
	menu = document.querySelector('.menu'),
	logo = document.querySelector('.logo'),
	cardsMenu = document.querySelector('.cards-menu'),
	restaurantTitle = document.querySelector('.restaurant-title'),
	rating = document.querySelector('.rating'),
	minPrice = document.querySelector('.price'),
	category = document.querySelector('.category'),
	inputSearch = document.querySelector('.input-search');

let login = localStorage.getItem('deliveryLogin');

const getData = async function (url) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Error on address ${url}, 
		Status ${response.status}!`);
	}
	return await response.json();
};
const valid = function (str) {
	const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
	return nameReg.test(str);
};

function toggleModal() {
	modal.classList.toggle('is-open');
}

function toggleModalAuth() {
	loginInput.style.borderColor = '';
	modalAuth.classList.toggle('is-open');
}

function authorized() {
	function logOut() {
		login = null;
		buttonAuth.style.display = '';
		userName.style.display = '';
		buttonOut.style.display = '';
		buttonOut.removeEventListener('click', logOut);
		localStorage.removeItem('deliveryLogin');
		checkAuth();
	}
	userName.textContent = login;
	buttonAuth.style.display = 'none';
	userName.style.display = 'inline';
	buttonOut.style.display = 'block';
	buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
	function logIn(event) {
		event.preventDefault();

		if (valid(loginInput.value)) {
			login = loginInput.value;
			localStorage.setItem('deliveryLogin', login);
			toggleModalAuth();
			buttonAuth.removeEventListener('click', toggleModalAuth);
			closeAuth.removeEventListener('click', toggleModalAuth);
			loginForm.removeEventListener('submit', logIn);
			loginForm.reset();
			checkAuth();
		} else {
			loginInput.style.outline = 'transparent';
			loginInput.style.borderColor = 'red';
			loginInput.value = '';
		}
	}
	buttonAuth.addEventListener('click', toggleModalAuth);
	closeAuth.addEventListener('click', toggleModalAuth);
	loginForm.addEventListener('submit', logIn);
}

function checkAuth() {
	if (login) {
		authorized();
	} else {
		notAuthorized();
	}
}

function createCardRestaurants({ image, kitchen, name, price, stars, products, timeOfDelivery }) {
	const card = document.createElement('a');
	// card.classList.add('card');
	// card.classList.add('card-restaurant'); same as: card.className...
	card.className = 'card card-restaurant';
	card.products = products;
	card.info = [name, price, stars, kitchen];
	card.insertAdjacentHTML(
		'beforeend',
		`
		<img src="${image}" alt="image" class="card-image" />
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title">${name}</h3>
				<span class="card-tag tag">${timeOfDelivery} мин</span>
			</div>
			<div class="card-info">
				<div class="rating">
					${stars}
				</div>
				<div class="price">От ${price} ₽</div>
				<div class="category">${kitchen}</div>
			</div>
		</div>
		
	`
	);
	cardsRestaurants.insertAdjacentElement('beforeend', card);
}

function createCardGood({ description, image, name, price }) {
	const card = document.createElement('div');
	card.className = 'card';
	card.insertAdjacentHTML(
		'beforeend',
		`
		<img src="${image}" alt="${name}" class="card-image" />
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">${name}</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">${description}
				</div>
			</div>
			<div class="card-buttons">
				<button class="button button-primary button-add-cart">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price-bold">${price} ₽</strong>
			</div>
		</div>
	`
	);
	cardsMenu.insertAdjacentElement('beforeend', card);
}
// Opens the restaurant menu
function openGoods(event) {
	const target = event.target,
		restaurant = target.closest('.card-restaurant');

	if (restaurant) {
		if (login) {
			const [name, price, stars, kitchen] = restaurant.info;
			cardsMenu.textContent = '';
			containerPromo.classList.add('hide');
			restaurants.classList.add('hide');
			menu.classList.remove('hide');

			restaurantTitle.textContent = name;
			rating.textContent = stars;
			minPrice.textContent = `От ${price} ₽`; //"От " + price + " ₽";
			category.textContent = kitchen;
			getData(`./db/${restaurant.products}`).then((data) => {
				data.forEach(createCardGood);
			});
		} else {
			toggleModalAuth();
		}
	}
}

function init() {
	getData('./db/partners.json').then((data) => {
		data.forEach(createCardRestaurants);
	});
	buttonCart.addEventListener('click', toggleModal);
	buttonClose.addEventListener('click', toggleModal);
	cardsRestaurants.addEventListener('click', openGoods);
	logo.addEventListener('click', () => {
		containerPromo.classList.remove('hide');
		restaurants.classList.remove('hide');
		menu.classList.add('hide');
	});

	inputSearch.addEventListener('keydown', (event) => {
		if (event.keyCode === 13) {
			const target = event.target,
				value = target.value.toLowerCase().trim(),
				goods = [];
			target.value = '';
			if (login) {
				if (!value || value.length < 3) {
					target.style.borderColor = 'red';
					target.style.outline = 'transparent';

					setTimeout(() => {
						target.style.borderColor = '';
					}, 3000);
					return;
				}
				getData('./db/partners.json').then((data) => {
					const products = data.map((item) => {
						return item.products;
					});
					products.forEach((product) => {
						getData(`./db/${product}`)
							.then((data) => {
								goods.push(...data);

								const searchGoods = goods.filter((item) => {
									return item.name.toLowerCase().includes(value);
								});
								cardsMenu.textContent = '';
								containerPromo.classList.add('hide');
								restaurants.classList.add('hide');
								menu.classList.remove('hide');

								restaurantTitle.textContent = 'Search result';
								rating.textContent = '';
								minPrice.textContent = '';
								category.textContent = '';

								return searchGoods;
							})
							.then((data) => {
								if (data.length === 0) {
									restaurantTitle.textContent = 'Item not found!';
									minPrice.style.display = 'none';
								}
								data.forEach(createCardGood);
							});
					});
				});
			} else {
				toggleModalAuth();
			}
		}
	});
	checkAuth();

	new Swiper('.swiper-container', {
		loop: true,
		autoplay: {
			delay: 3000,
		},
	});
}

init();
