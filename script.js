(function runIQTestLogic() {
	// progress bar initial style
	const readiness = document.querySelector('.completion__readiness');
	readiness.style.width = '7.14%';
	// array of the IQ test's answers
	const res = [];

	hideMenuOnClick()
	listenToStartTestButtons();

	function hideMenuOnClick() {
		const menuItems = document.querySelectorAll('.menu li');
		menuItems.forEach(v => v.addEventListener('click', () => {
			const sideMenu = document.querySelector('#side-menu');
			sideMenu.checked = false;
		}));
	}
	function listenToStartTestButtons() {
		const startButton = document.querySelectorAll('.js-startTest');
		startButton.forEach(v => v.addEventListener('click', startTest));
	}
	function startTest() {
		const menuItems = document.querySelectorAll('.menu li');
		const main = document.querySelector('.js-wrapper');
		const heading = document.querySelector('.heading');
		const testPage = document.querySelector('.testpage');
		const testPageButton = document.querySelectorAll('.testpage__button');
		// hide all menu links except main page
		menuItems.forEach((v, i) => i > 0 ? v.classList.add('hide') : v);
		// hide main page and show test
		main.classList.add('hide');
		testPage.classList.remove('hide');
		heading.classList.remove('hide');
		// listen to buttons inside test
		testPageButton.forEach(v => v.addEventListener('click', checkPage));
	}
	function checkPage(e) {
		// check all radio for active status
		let inputs = Array.from(e.target.parentElement.querySelectorAll('*'));
		// if one item checked write answer 
		if (inputs.some(v => v.checked)) {
			writeResult(e.target);
			changePage(e.target);
			// if the progress bar is full finish test
			if (parseFloat(readiness.style.width) > 98) {
				finishTest(e.target);
				return;
			}
		}
	}
	function writeResult(target) {
		// push every answer to the array "res"
		let allChildren = target.parentElement.querySelectorAll('*');
		if (Array.from(allChildren).some(v => v.checked)) {
			allChildren.forEach(v => v.checked ? res.push(v.value) : v);
			// console.log(res);
		}
	}
	function changePage(el) {
		el.parentElement.parentElement.classList.add('hide');
		el.parentElement.parentElement.nextElementSibling.classList.remove('hide');
		readiness.style.width = 7.14 + parseFloat(readiness.style.width) + '%';
	}
	function finishTest(item) {
		item.parentElement.parentElement.classList.add('hide');
		item.parentElement.parentElement.nextElementSibling.classList.remove('hide');
		dotMaker(item);
	}
	function dotMaker(item) {
		let dot = document.querySelector('.testpage__dot');
		let refreshDot = setInterval(() => {
			dot.insertAdjacentHTML('afterend', '<span class="testpage__dot">. </span>');
			if (document.querySelectorAll('.testpage__dot').length == 43) {
				clearInterval(refreshDot);
				showPreliminaryResults(item);
			}
		}, 200);
	}
	function showPreliminaryResults() {
		const heading = document.querySelector('.heading');
		const testPage = document.querySelector('.testpage');
		const resultPage = document.querySelector('.testpage__result');
		const callButton = document.querySelector('.testpage__call');
		heading.innerHTML = 'ГОТОВО!';
		heading.classList.add('heading-large');
		testPage.classList.add('hide');
		resultPage.classList.remove('hide');
		// start countdown
		countdown(10, 0);
		// set and remove listener after showing results
		callButton.addEventListener('click', function () {
			showResults();
			callButton.removeEventListener('click', arguments.callee);
		});
	}
	function countdown(m, s) {
		const timer = document.querySelector('.testpage__timer');
		let interval = setInterval(function () {
			if (m == 0 && s == 0) {
				clearInterval(interval);
				return;
			}
			if (m > 0 && s == 0) {
				m--;
				s = 60;
			}
			s--;
			if (m.toString().length < 2) m = "0" + m;
			if (s.toString().length < 2) s = "0" + s;
			timer.innerHTML = `${m}:${s}`;
		}, 1000);
	}
	function showResults() {
		const results = document.querySelector('.testpage__results');
		let url = 'https://swapi.dev/api/people/1/';
		fetch(url).then(response => response.json()).then(data => {
			results.insertAdjacentHTML('beforeend', `<p>Name: ${data.name}</p>`);
			results.insertAdjacentHTML('beforeend', `<p>Birth year: ${data.birth_year}</p>`);
			results.insertAdjacentHTML('beforeend', `<p>Sex: ${data.gender}</p>`);
			results.insertAdjacentHTML('beforeend', `<p>Height: ${data.height}</p>`);
			results.insertAdjacentHTML('beforeend', `<p>Mass: ${data.mass}</p>`);
			results.insertAdjacentHTML('beforeend', `<p>Eye color: ${data.eye_color}</p>`);
			results.insertAdjacentHTML('beforeend', `<p>Hair color: ${data.hair_color}</p>`);
			results.insertAdjacentHTML('beforeend', `<p>Skin color: ${data.skin_color}</p>`);
		});
	}
})();