// Referencia a las clases del DOM
const search = document.querySelector('.main__input');
const btnSearch = document.querySelector('.main__button');
const btnRandom = document.querySelector('.main__random');

// Animación al cargar la página y cuando se busca autor por los botones random y search
const loadSpinner = () => {
  document.querySelector('.main__author').textContent = 'Searching...';  
  document.querySelector('.main__article').innerHTML = `<div class="spinner"></div>`;
}

// Conexión a la API 'quote-garden quotes'
const getAuthorName = () => {
  if(search.value === '') {
    swal('', 'Ingrese nombre del autor...', 'info', {
      buttons: false,
      timer: 1500,
    })
    .then(() => search.focus());
  } else {
    loadSpinner();
    fetch(`https://quote-garden.herokuapp.com/api/v3/quotes?author=${search.value}&limit=4`)
    .then(response => response.json())
    .then(quotes => showAuthorQuotes(quotes))
    .catch(error => {
      document.querySelector('.spinner').style.display = 'none';
      error = 'Not found... try again!';
      document.querySelector('.main__author').textContent = `${error}`;  
      search.value = '';
      search.focus();
    });
  }
}

// Muestra los datos al dar click en el botón search
const showAuthorQuotes = quotes => {
  document.querySelector('.main__author').textContent = quotes.data[0].quoteAuthor;  
  let body = '';
  for(let i=0; i<quotes.data.length; i++) {
    body += `
      <div class="quotes">
        <h3 class="quotes__title">${quotes.data[i].quoteGenre}</h3>
        <p class="quotes__text">"${quotes.data[i].quoteText}"</p>
      </div>
    `;
    document.querySelector('.main__article').innerHTML = body;
  }
  search.value = '';
  search.focus();
} 

// Evento del botón 'btnSearch'
btnSearch.addEventListener('click', getAuthorName);

// Obtiene un número aleatorio de 1 al 11370
const getRandomNumber = () => Math.floor((Math.random() * 11370) + 1);

// Conexión a la API 'quote-garden authors' y 'quote-garden quotes'
const getRandomAuthorName = () => {
  loadSpinner();
  fetch(`https://quote-garden.herokuapp.com/api/v3/authors`)
  .then(response => response.json())
  .then(authors => {
    let name = authors.data[getRandomNumber()];
    console.log(name); // Trae el autor correctamente
    fetch(`https://quote-garden.herokuapp.com/api/v3/quotes?author=${name}&limit=4`)
    .then(response => response.json())
    .then(random => showRandomQuote(random));
  });
}

// Muestra los datos según el resultado del botón random 
const showRandomQuote = random => {
  console.log(random.data);
  console.log(random.data[0].quoteAuthor); // A veces quoteAuthor is undefined
  document.querySelector('.main__author').textContent = random.data[0].quoteAuthor;  
  let body = '';
  for(let i=0; i<random.data.length; i++) {
    body += `
      <div class="quotes">
        <h3 class="quotes__title">${random.data[i].quoteGenre}</h3>
        <p class="quotes__text">"${random.data[i].quoteText}"</p>
      </div>
    `;
    document.querySelector('.main__article').innerHTML = body;
  }
} 

// Evento del botón 'btnRandom'
btnRandom.addEventListener('click', getRandomAuthorName);

// Carga la página llamando a la función quoteRandom()
window.onload = getRandomAuthorName();