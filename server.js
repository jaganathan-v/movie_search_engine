const express=require("express")
const cors=require("cors")
const {MongoClient}=require("mongodb")
const path=require("path")

const app=express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))
app.use(express.static(path.join(__dirname,"public")))

const uri="mongodb+srv://jaganathan7v_db_user:Jagan7@cluster0.3sxrcmt.mongodb.net/?appName=Cluster0"

const client=new MongoClient(uri)

let movies

async function start(){

await client.connect()

const db=client.db("sample_mflix")

movies=db.collection("movies")

console.log("MongoDB Connected")

app.get("/",(req,res)=>{
res.sendFile(path.join(__dirname,"public","index.html"))
})

app.get("/api/search",async(req,res)=>{

const query=req.query.q

if(!query) return res.json([])

const results=await movies.aggregate([

{
$search:{
index:"default",
autocomplete:{
query:query,
path:"title",
fuzzy:{maxEdits:2}
}
}
},

{$limit:10},

{$project:{
title:1,
year:1,
genres:1,
poster:1,
plot:1
}}

]).toArray()

res.json(results)

})

app.get("/api/trending",async(req,res)=>{

const data=await movies.aggregate([
{$sample:{size:12}}
]).toArray()

res.json(data)

})

app.get("/api/recommend/:genre",async(req,res)=>{

const genre=req.params.genre

const rec=await movies.find({
genres:genre
}).limit(8).toArray()

res.json(rec)

})

app.listen(3000,()=>{
console.log("Server running at http://localhost:3000")
})

}

start()
