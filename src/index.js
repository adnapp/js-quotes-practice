quoteList = document.querySelector('#quote-list')
newQuoteForm = document.querySelector('#new-quote-form')
newQuote = document.querySelector('#new-quote.form-control')
newAuthor = document.querySelector('#author.form-control')


fetch(`http://localhost:3000/quotes?_embed=likes`)
.then(res => res.json())
.then(data => renderQuotes(data))

function renderQuotes(quotesArray) {
    quotesArray.forEach(quote => renderQuote(quote))
}

function renderQuote(quote){
    // debugger
 quoteDiv = document.createElement('div');
 quoteDiv.innerHTML = `
 <li class='quote-card'>
 <blockquote class="blockquote">
   <p class="mb-0">${quote.quote}</p>
   <footer class="blockquote-footer">${quote.author}</footer>
   <br>
   <button class='btn-success' data-id=${quote.id}>Likes: <span>${quote.likes.length}</span></button>
   <button class='btn-danger' data-id=${quote.id}>Delete</button>
   <button class='btn-edit' data-id=${quote.id}>Edit</button>

   </blockquote>
 </li>
   `
   quoteList.appendChild(quoteDiv)
}

newQuoteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const newQuoteObj = {
        quote: newQuote.value,
        author: newAuthor.value,
        likes: []
    }

    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            // "Allowed": "application/json"
        },
        body: JSON.stringify(newQuoteObj)
    })
    .then(res => res.json())
    .then(data => renderQuote(data))
    event.target.reset();
// ask about pessimistic/optimitic rendering    
})

quoteList.addEventListener("click", (event)=> {
    // debugger
    
    //conditional, to see if it is like or delete
    
    if (event.target.classList.value === "btn-danger") {
        const id = event.target.dataset.id

        //we want pessimistic rendering, so it will be within then
        fetch(`http://localhost:3000/quotes/${id}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            // debugger
            //want to delete quote card here (right above)
            quoteCard = event.target.closest('.quote-card')
            quoteCard.remove()
        })

    }

    if (event.target.classList.value === "btn-success") {
        let id = event.target.dataset.id
        id = parseInt(id)
        let numericLikes =  event.target.textContent.replace ( /[^\d.]/g, '' );
        numericLikes = parseInt(numericLikes)
        numericLikes = numericLikes + 1
        // debugger
        updateLikeObj = {
            quoteId: id,
            likes: numericLikes
        }

        fetch(`http://localhost:3000/likes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateLikeObj)
        })
        .then(res => res.json())
        .then(data => {
            //need to add refresh the one who has the new like
            event.target.textContent = "Likes: " + numericLikes
        })
    }



})

