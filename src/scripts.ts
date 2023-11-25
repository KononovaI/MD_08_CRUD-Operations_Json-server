import axios from 'axios';
import { differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';

// Norādam DOM elementu
const cards = document.querySelector<HTMLDivElement>('.js-cards');

// Definējam tipu Book. Attēlo objekta struktūru
type Book = {
	title: string;
	author: string;
	topic: string;
	year: number;
	createdAt: string;
	img: string;
	id: number;
};


// Funkcija getBook. Paņem grāmatas no servera (ar axios GET pieprasījumu), un atjauno HTML ar grāmatu info
const getBook = (): void => {
	cards.innerHTML = '';

  axios.get<Book[]>('http://localhost:3004/books').then((response) => { // READ
    response.data.forEach((book) => {
      cards.innerHTML += `
      <div class="books__wrapper">
				<div class="book__wrapper">
					<div class="book__img-wrapper" width="500" height="333">
						<img src="${book.img}" class="book__img" alt="Book cover">
					</div>
					<div class="book__inputs">
						<div class="book__input">${book.title}</div>
						<div class="book__input">${book.author}</div>
						<div class="book__input">${book.topic}</div>
						<div class="book__input">${book.year}</div>
						<div class="book-buttons">
							<button class="crud__button js-edit-button" data-book-id="${book.id}">Edit</button>
							<button class="crud__button js-delete-button" data-book-id="${book.id}">Delete</button>
						</div>
						<div class="book__timestamp"></div>
					</div>
				</div>
			</div>
    `;
    });
    addDeleteToBooks();
  });
};
getBook(); //Izsaucam funkciju



// Veidojam jaunu grāmatas ierakstu
const form = document.querySelector<HTMLFormElement>('.js-form');

	form.addEventListener('submit', (event) => {
		event.preventDefault();

		const formData = new FormData(form);
		const title = formData.get('title');
		const author = formData.get('author');
		const topic = formData.get('topic');
		const year = formData.get('year');
		const img = formData.get('img');

		axios.post('http://localhost:3004/books', { // Radam ierakstu datu bāzē ar post jeb C (Create no CRUD)
			"title": title,
      "author": author,
      "topic": topic,
      "year": year,
      "created": new Date(),
      "img": img,
		}).then(() => {
			form.reset(); // Notīram visu, lai pirms tam esošās grāmatas nedublējas
			getBook(); // Izsaucam funkciju, t.i. parādam visas šobrīd datu bāzē esošās grāmatas

			// Veidojam Tostify, lai parādās ziņa,kas apliecina grāmatas radīšanu. Sk.zemāk:
			//@ts-ignore
			window.Toastify({
				text: "Book has been added!",
				duration: 5000,
				destination: "https://github.com/apvarun/toastify-js",
				newWindow: true,
				close: true,
				gravity: "top", // `top` or `bottom`
				position: "center", // `left`, `center` or `right`
				stopOnFocus: true, // Prevents dismissing of toast on hover
				style: {
					background: "linear-gradient(to right, #00b09b, #96c93d)",
				},
				onClick: function(){} // Callback after click
			}).showToast();

		})
	})


// Dzēšana - DONE
const addDeleteToBooks = () => {
  const bookDeleteButton = document.querySelectorAll<HTMLButtonElement>('.js-delete-button');
  bookDeleteButton.forEach((bookDeleteBtn) => {
    bookDeleteBtn.addEventListener('click', () => {
      const { bookId } = bookDeleteBtn.dataset; // Tagad pēc destructuring principa darbojas. Bija: const bookId = bookDeleteBtn.dataset.cardId; Ja data-book-id aizvieto ar data-card-id, tad jāizmanto šis kods 
      axios.delete(`http://localhost:3004/books/${bookId}`).then(() => {
        getBook();

				// Veidojam Tostify, lai parādās ziņa,kas apliecina datu dzēšanu. Sk.zemāk:
				//@ts-ignore
				window.Toastify({
					text: "Book has been deleted!",
					duration: 5000,
					destination: "https://github.com/apvarun/toastify-js",
					newWindow: true,
					close: true,
					gravity: "top", // `top` or `bottom`
					position: "center", // `left`, `center` or `right`
					stopOnFocus: true, // Prevents dismissing of toast on hover
					style: {
						background: "linear-gradient(to right, #blue, #96c93d)",
					},
					onClick: function(){} // Callback after click
				}).showToast();

      });
    });
  });
};