const searchInput=document.getElementById("search")
const suggestions=document.getElementById("suggestions")
const moviesDiv=document.getElementById("movies")
const recDiv=document.getElementById("recommendations")

searchInput.addEventListener("input",async()=>{

const query=searchInput.value

if(query.length<2){
suggestions.innerHTML=""
return
}

const res=await fetch(`/api/search?q=${query}`)
const data=await res.json()

suggestions.innerHTML=""

data.forEach(movie=>{

const div=document.createElement("div")

div.innerText=movie.title

div.onclick=()=>loadRecommendations(movie.genres[0])

suggestions.appendChild(div)

})

})

async function loadTrending(){

const res=await fetch("/api/trending")

const data=await res.json()

moviesDiv.innerHTML=""

data.forEach(movie=>{

const card=document.createElement("div")

card.className="movie"

card.innerHTML=`

<h3>${movie.title}</h3>
<p>${movie.year || ""}</p>

`

moviesDiv.appendChild(card)

})

}

async function loadRecommendations(genre){

const res=await fetch(`/api/recommend/${genre}`)

const data=await res.json()

recDiv.innerHTML=""

data.forEach(movie=>{

const card=document.createElement("div")

card.className="movie"

card.innerHTML=`
<h3>${movie.title}</h3>
<p>${movie.year || ""}</p>
`

recDiv.appendChild(card)

})

}

loadTrending()

function voiceSearch(){

const recognition=new webkitSpeechRecognition()

recognition.onresult=function(event){

const speech=event.results[0][0].transcript

searchInput.value=speech

searchInput.dispatchEvent(new Event("input"))

}

recognition.start()

}
