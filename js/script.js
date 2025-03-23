// Referencia a las clases del DOM
const search = document.querySelector('.main__input');
const btnSearch = document.querySelector('.main__button');
const btnRandom = document.querySelector('.main__random');

// Animación al cargar la página y cuando se busca autor por los botones random y search
const loadSpinner = () => {
  document.querySelector('.main__author').textContent = 'Searching...';  
  document.querySelector('.main__article').innerHTML = `<div class="spinner"></div>`;
}

// ---> Conexión a la API 'https://github.com/lukePeavey/quotable'

// Obtener autor por su nombre
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
				// console.log("search:", authors.results[0]);
				// Obtiene id del autor
				getAuthorID(authors.results[0]._id);
			})
			.catch((error) => {
				document.querySelector(".spinner").style.display = "none";
				error = "Not found... try again!";
				document.querySelector(".main__author").textContent = `${error}`;
				search.value = "";
				search.focus();
			});
    search.value = '';
    search.focus();
  }
}

// Evento del botón 'btnSearch'
btnSearch.addEventListener('click', getAuthorName);

// Obtener un numero aleatorio segun el parametro pasado
	const getRandomNumber = (number) => Math.floor(Math.random() * number + 1);
  // console.log("Random number:", getRandomNumber(41));

// Obtener autor aleatorio
const getRandomAuthor = () => {
	loadSpinner();
	// Obtener paginas aleatoria (1 al 41)
	fetch(`https://api.quotable.io/authors?sortBy=name&page=${getRandomNumber(41)}`)
	  .then((response) => response.json())
	  .then((authors) => {
      // Obtener id del autor aleatorio (1 al 20)
      getAuthorID(authors.results[getRandomNumber(20)]._id);
	  });
}

// Obtener datos del autor por su id
const getAuthorID = (id) => {
	fetch(`https://api.quotable.io/authors/${id}`)
		.then((response) => response.json())
		.then((data) => showAuthorQuote(data));
};

// Mostrar datos según el resultado del boton random 
const showAuthorQuote = data => {
  // console.log("Random:", data);  
  if (data.quotes.length === 0) {
    // Agrega el nombre del autor
    document.querySelector(".main__author").textContent = data.name;
    // Mensaje si no hay citas disponibles para el autor
    document.querySelector(".main__article").innerHTML = `
      <div class="quotes">
        <p>No quotes available for this author</p>
      </div>            
    `;
  } else {
    // Agrega el nombre del autor
    document.querySelector(".main__author").textContent = data.name;
    // Agrega las citas del autor
		let body = "";
		for (let i = 0; i < data.quotes.length; i++) {
			body += `
        <div class="quotes">
          <h3 class="quotes__title">${data.quotes[i].tags[0]}</h3>
          <p class="quotes__text">"${data.quotes[i].content}"</p>
        </div>
      `;
			document.querySelector(".main__article").innerHTML = body;
		}
  } 
}

// Evento del boton 'btnRandom'
btnRandom.addEventListener('click', getRandomAuthor);

// Carga la pagina llamando a la funcion 'quoteRandom()'
window.onload = getRandomAuthor();