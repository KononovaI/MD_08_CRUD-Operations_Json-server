import axios from 'axios';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

// Norādam DOM elementu
const cards = document.querySelector<HTMLDivElement>('.js-cards');

// Definējam tipu Book. Attēlo objekta struktūru
type Book = {
	title: string;
	author: string;
	topic: string;
	year: number;
	created: string;
	img: string;
	id: number;
};


// Funkcija getBook. Paņem grāmatas no servera (ar axios GET pieprasījumu), un atjauno HTML ar grāmatu info
const getBook = (): void => {
	cards.innerHTML = '';

  axios.get<Book[]>('http://localhost:3004/books').then((response) => { // READ. Paņemam datus no servera.
    response.data.forEach((book) => { // Iterējam cauri katrai grāmatai (ko saņemam no servera) ...

			const timestamp = formatDistanceToNow(new Date(book.created)); // ... izveidojam mainīgo, lai aprēķinās laiks no tagad līdz grāmatas saglabāšanai datu bāzē.

      // ... izveidojam HTML elementus katrai grāmatai, ievietojot tur attiecīgas grāmatas elementus
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
							<button class="crud__button js-delete-button" data-book-id="${book.id}">Delete</button>
						</div>
						<div class="book__timestamp">Created ${timestamp} ago</div>
					</div>
				</div>
			</div>
    `;
    });
    addDeleteToBooks(); // Pēc grāmatu renderēšanas tiek izsaukta funkcija, kas pievieno dzēšanas funkciju pogai Delete.
  });
};
getBook(); //Izsaucam pašu funkciju



// Veidojam jaunu grāmatas ierakstu
const form = document.querySelector<HTMLFormElement>('.js-form');

	form.addEventListener('submit', (event) => {
		event.preventDefault();

		const formData = new FormData(form); // FormData objekts nodrošina veidu, kā viegli izveidot key-value pāru kopu. Šajā gadījumā to izmanto, lai tvertu datus, kas iesniegti, izmantojot HTML formu (const form 57.rindiņā). Vispār FormData ir viens no daudzajiem API interfeisiem jeb objektu tipiem. https://developer.mozilla.org/en-US/docs/Web/API
		const title = formData.get('title'); // formData.get() metode ļauj iegūt konkrētu formas elementa vērtību (kādu no 22-26.rindiņas HTML failā, līdz kuram, savukārt tiekam caur to pašu const form, kas definēta te 57.rindā). Šajā gadījumā tas ir input lauka title vērtība. Citas metodes skat. https://developer.mozilla.org/en-US/docs/Web/API/FormData
		const author = formData.get('author');
		const topic = formData.get('topic');
		const year = formData.get('year');
		const img = formData.get('img');

		axios.post('http://localhost:3004/books', { // Radam ierakstu datu bāzē ar post jeb C (Create no CRUD). Sūtam uz DB tos datus, ko ieguvām no formas inputiem ar FormData() un formData.get() palīdzību (skat.62.-67.rinu)
			"title": title,
      "author": author,
      "topic": topic,
      "year": year,
			"img": img,
      "created": new Date(),
		}).then(() => {
			form.reset(); // Notīram visu, lai pirms tam esošās grāmatas nedublējas. Šis īsais pieraksts ir iespējams pateicoties tam, ka HTML'ā noformēts kā <form></form>

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