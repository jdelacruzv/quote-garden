/* 
  Referencia a las clases del DOM
*/
const search = document.querySelector('.main__input');
const btnSearch = document.querySelector('.main__button');
const btnRandom = document.querySelector('.main__random');


/*
  Animación al cargar la página y cuando se busca autor por los 
  botones random y search
*/
const loadSpinner = () => {
  document.querySelector('.main__author')
    .textContent = 'Searching...';  
  document.querySelector('.main__article')
    .innerHTML = `<div class="spinner"></div>`;
}


/*
  ---> Conexión a la API 'https://github.com/lukePeavey/quotable'
*/

/*
  Obtener autor por su nombre
*/
const getAuthorName = () => {
  if(search.value === '') {
    swal('', 'Ingrese nombre del autor...', 'info', {
      buttons: false,
      timer: 1500,
    })
    .then(() => search.focus());
  } else {
    loadSpinner();
    // Buscar autor por su nombre
    fetch(`https://api.quotable.io/search/authors?query=${search.value}`)
			.then((response) => response.json())
			.then(authors => {
				// Validación para asegurarse de que haya resultados antes de 
        // acceder a authors.results[0]
				if (authors.results && authors.results.length > 0) {
					// Obtiene id del autor
					getAuthorID(authors.results[0]._id);
				} else {
					// Manejar caso donde no se encuentra el autor
					document.querySelector(".spinner")
            .style.display = "none";
					document.querySelector(".main__author")
            .textContent = "Not found... try again!";
				}
			})
			.catch((error) => {
				document.querySelector(".spinner")
          .style.display = "none";
				error = "Not found... try again!";
				document.querySelector(".main__author")
          .textContent = `${error}`;
				search.value = "";
				search.focus();
			});
    search.value = '';
    search.focus();
  }
}


/* 
  Evento del botón 'btnSearch'
*/
btnSearch.addEventListener('click', getAuthorName);


/* 
  Obtener número aleatorio de 0 a (number - 1)
*/
const getRandomNumber = (number) => Math.floor(Math.random() * number);
// console.log("Random number (0-40):", getRandomNumber(41)); // Ejemplo: 0 a 40


/* 
  Obtener autor aleatorio
*/
const getRandomAuthor = () => {
	loadSpinner();
	// getRandomNumber(41) devuelve 0-40, así que sumamos 1 para obtener la página 1-41
	const randomPage = getRandomNumber(41) + 1;
	// Obtener paginas aleatoria (1 al 41)
	fetch(`https://api.quotable.io/authors?sortBy=name&page=${randomPage}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then((authors) => {
			// Asegurarse de que haya resultados antes de intentar obtener un índice
			if (authors.results && authors.results.length > 0) {
        // Usamos authors.results.length para asegurar que el índice sea de 0 a length-1
				const randomIndex = getRandomNumber(authors.results.length);
				// Obtener id del autor aleatorio correcto
				getAuthorID(authors.results[randomIndex]._id);
			} else {
				// Manejar el caso de que la página no devuelva autores
				document.querySelector(".spinner")
          .style.display = "none";
				document.querySelector(".main__author")
          .textContent = "No authors found on this page.";
			}
		})
		.catch((error) => {
      // Manejo de errores para errores de red, certificado o fallo de fetch
      document.querySelector(".spinner")
        .style.display = "none";
			document.querySelector(".main__author")
        .textContent = "API error. Check network or server status.";
			document.querySelector(".main__article")
        .innerHTML = "";
			console.error("Error fetching random author:", error);
		});
}


/* 
  Obtener datos del autor por su id
*/
const getAuthorID = (id) => {
	fetch(`https://api.quotable.io/authors/${id}`)
		.then((response) => response.json())
		.then((data) => showAuthorQuote(data))
    .catch((error) => {
        document.querySelector(".spinner")
          .style.display = "none";
        document.querySelector(".main__author")
          .textContent = `Error fetching author details. (${error.message})`;
    });
};


/* 
  Mostrar datos según el resultado del boton random 
*/
const showAuthorQuote = data => {
  // console.log("Random:", data);  
  if (data.quotes.length === 0) {
    // Agrega el nombre del autor
    document.querySelector(".main__author")
      .textContent = data.name;
    // Mensaje si no hay citas disponibles para el autor
    document.querySelector(".main__article")
      .innerHTML = `
        <div class="quotes">
          <p class="quotes__error-message">No quotes available for this author</p>
        </div>            
      `;
  } else {
    // Agrega el nombre del autor
    document.querySelector(".main__author")
      .textContent = data.name;
    // Agrega las citas del autor
		let body = "";
		for (let i = 0; i < data.quotes.length; i++) {
			body += `
        <div class="quotes">
          <h3 class="quotes__title">${data.quotes[i].tags[0]}</h3>
          <p class="quotes__text">"${data.quotes[i].content}"</p>
        </div>
      `;
			document.querySelector(".main__article")
        .innerHTML = body;
		}
  } 
}


/* 
  Evento del boton 'btnRandom'
*/
btnRandom.addEventListener('click', getRandomAuthor);


/*
  Carga la pagina llamando a la funcion 'quoteRandom()'
*/
window.onload = getRandomAuthor();