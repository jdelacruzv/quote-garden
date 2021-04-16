// Carga la página llamando a la función quoteRandom()
window.onload = getRandomQuote();

// Referencia a la clase 'header__button' del DOM
let search = document.querySelector('.header__input');
let btnSearch = document.querySelector('.header__button');
search.focus();

// Evento del botón 'btnSearch'
btnSearch.addEventListener('click', getAllQuote);

// Conexión a la API 'quote-garden quotes'
function getAllQuote() {
    document.querySelector('.main__title').style.display = 'block';
    if(search.value === '') {
        swal('Ingrese nombre del autor', '', 'error');
    } else {
        // totalQuotes = 72672, totalAuthors = 11369
        fetch(`https://quote-garden.herokuapp.com/api/v3/quotes?author=${search.value}`)
            .then(response => response.json())
            .then(quotes => showAllQuote(quotes))
            .catch(error => swal('El autor no existe!', '', 'error'))        
    }
    search.value = '';
    search.focus();
}

// Muestra los datos al dar click en el botón search
function showAllQuote(quotes) {
    console.log(quotes.data);
    let author = document.querySelector('.main__title');
    author.textContent = quotes.data[0].quoteAuthor;  
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

// Referencia a la clase 'header__random' del DOM
let btnRandom = document.querySelector('.header__random');
btnRandom.addEventListener('click', getRandomQuote);

// Conexión a la API 'quote-garden random'
function getRandomQuote() {
    fetch('https://quote-garden.herokuapp.com/api/v3/quotes/random?count=5')
        .then(response => response.json())
        .then(random => showRandomQuote(random))
        .catch(error => console.log(error))
}

// Muestra los datos según el resultado del botón random 
function showRandomQuote(random) {
    document.querySelector('.main__title').textContent = 'Autores varios';
    let body = '';
    for(let i=0; i<random.data.length; i++) {
        body += `
            <div class="quotes">
                <h3 class="quotes__title">${random.data[i].quoteGenre}</h3>
                <p class="quotes__text">"${random.data[i].quoteText}"</p>
                <p class="quotes__author">${random.data[i].quoteAuthor}</p>
            </div>
        `;
        document.querySelector('.main__article').innerHTML = body;
    }
    search.focus();
} 