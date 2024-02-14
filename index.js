import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

let list = new Array();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get('/', (req, res)=>{
    const today = new Date().toLocaleDateString('en-US', {weekday: "long", day: "numeric", month: "long"});
    res.render("index.ejs", {today, list});
});


app.post('/new', (req, res)=>{
    const newTodo = req.body['new-todo'];
    list = [newTodo, ...list];
    res.redirect("/");
});

app.listen(port, ()=>{
    console.log(`Server lising at http://localhost:${port}/`);
})