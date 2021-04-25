// Referencia a las clases del DOM
let search = document.querySelector('.header__input');
let btnSearch = document.querySelector('.header__button');
let btnRandom = document.querySelector('.header__random');

// Conexión a la API 'quote-garden quotes'
const getAuthorName = () => {
    if(search.value === '') {
        swal('Ingrese nombre del autor', '', 'error');
    } else {
        fetch(`https://quote-garden.herokuapp.com/api/v3/quotes?author=${search.value}&limit=4`)
        .then(response => response.json())
        .then(quotes => showAuthorQuotes(quotes))
        .catch(error => swal('El autor no existe!', '', 'error'))        
    }
    search.value = '';
}

// Muestra los datos al dar click en el botón search
const showAuthorQuotes = quotes => {
    // console.log(quotes.data);
    document.querySelector('.main__title').textContent = quotes.data[0].quoteAuthor;  
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
} 

// Evento del botón 'btnSearch'
btnSearch.addEventListener('click', getAuthorName);

// Obtiene un número aleatorio de 1 al 11370
const getRandomNumber = () => Math.floor((Math.random() * 11370) + 1);

// Conexión a la API 'quote-garden authors' y 'quote-garden random'
const getRandomAuthorName = () => {
    fetch(`https://quote-garden.herokuapp.com/api/v3/authors`)
        .then(response => response.json())
        .then(authors => {
            let name = authors.data[getRandomNumber()];
            // console.log(name);
            fetch(`https://quote-garden.herokuapp.com/api/v3/quotes/random?author=${name}&count=4`)
                .then(response => response.json())
                .then(random => showRandomQuote(random));
        });
}

// Muestra los datos según el resultado del botón random 
const showRandomQuote = random => {
    document.querySelector('.main__title').textContent = random.data[0].quoteAuthor;  
    // console.log(random.data);
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