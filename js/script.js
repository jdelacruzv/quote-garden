/* 
  Referencia a las clases del DOM
*/
const search = document.querySelector(".main__input");
const btnSearch = document.querySelector(".main__button");
const btnRandom = document.querySelector(".main__random");

/*
  Animación al cargar la página y cuando se busca autor
*/
const loadSpinner = () => {
	document.querySelector(".main__author").textContent = "Searching...";
	document.querySelector(".main__article").innerHTML =
		`<div class="spinner"></div>`;
};

/*
  Obtener autor o frase aleatoria usando DummyJSON
*/
const getRandomAuthor = () => {
	loadSpinner();

	fetch("https://dummyjson.com/quotes/random")
		.then((response) => {
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			return response.json();
		})
		.then((data) => {
			// Verificamos si 'tags' existe y tiene elementos; si no, usamos un respaldo seguro
			const quoteTag =
				data.tags && data.tags.length > 0 ? data.tags[0] : "Quote";

			showAuthorQuote({
				name: data.author,
				quotes: [
					{
						content: data.quote,
						tags: [quoteTag],
					},
				],
			});
		})
		.catch((error) => {
			console.error("Error fetching quote:", error);
			showError("API error. Check network or server status.");
		});
};

/*
  Buscar frases por autor de forma segura filtrando localmente el catálogo
*/
const getAuthorName = () => {
	const query = search.value.trim();
	if (query === "") {
		swal("", "Ingrese nombre del autor...", "info", {
			buttons: false,
			timer: 1500,
		}).then(() => search.focus());
	} else {
		loadSpinner();

		fetch(`https://dummyjson.com/quotes?limit=150`)
			.then((response) => response.json())
			.then((data) => {
				const filteredQuotes = data.quotes.filter((q) =>
					q.author.toLowerCase().includes(query.toLowerCase()),
				);

				if (filteredQuotes.length > 0) {
					const authorName = filteredQuotes[0].author;
					showAuthorQuote({
						name: authorName,
						quotes: filteredQuotes.map((q) => {
							// Obtenemos la primera etiqueta de forma segura
							const tag = q.tags && q.tags.length > 0 ? q.tags[0] : "Quote";
							return {
								content: q.quote,
								tags: [tag],
							};
						}),
					});
				} else {
					showError("Not found... try again!");
				}
			})
			.catch((error) => {
				console.error("Search Error:", error);
				showError("Not found... try again!");
			});

		search.value = "";
		search.focus();
	}
};

/* 
  Mostrar datos en la interfaz
*/
const showAuthorQuote = (data) => {
	document.querySelector(".main__author").textContent = data.name;

	let body = "";
	for (let i = 0; i < data.quotes.length; i++) {
		body += `
      <div class="quotes">
        <h3 class="quotes__title">${data.quotes[i].tags[0] || "Quote"}</h3>
        <p class="quotes__text">"${data.quotes[i].content}"</p>
      </div>
    `;
	}
	document.querySelector(".main__article").innerHTML = body;
};

/*
  Función auxiliar para errores
*/
const showError = (message) => {
	const spinner = document.querySelector(".spinner");
	if (spinner) spinner.style.display = "none";
	document.querySelector(".main__author").textContent = message;
	document.querySelector(".main__article").innerHTML = "";
};

/* 
  Eventos de los botones
*/
btnSearch.addEventListener("click", getAuthorName);
btnRandom.addEventListener("click", getRandomAuthor);

/*
  Carga inicial al abrir la página
*/
window.addEventListener("DOMContentLoaded", getRandomAuthor);


/* 
  Lógica para el Modo Oscuro / Claro con iconos FontAwesome
*/
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Comprobar si el usuario ya tenía una preferencia guardada previamente
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
  document.body.classList.add('dark-mode');
  if (themeIcon) {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
}

// Evento para alternar el tema
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  
  let theme = 'light';
  if (document.body.classList.contains('dark-mode')) {
    theme = 'dark';
    // Cambiar a icono de Sol vectorial
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    // Cambiar a icono de Luna vectorial
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
  
  // Guardar la preferencia en el navegador
  localStorage.setItem('theme', theme);
});