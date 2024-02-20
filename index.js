import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

let list = new Array();
let workList = new Array();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get('/', (req, res)=>{
    const today = new Date().toLocaleDateString('en-US', {weekday: "long", day: "numeric", month: "long"});
    res.render("index.ejs", {listTitle: today, listItems: list});
});

app.post('/', (req, res)=>{
    const newItem = req.body['newItem'];
    if(req.body.list === "Work"){
        workList = [newItem, ...workList];
        res.redirect("/work");
    } else{
        list = [newItem, ...list];
        res.redirect("/");
    }
});

app.get('/work', (req, res)=>{
    res.render("index.ejs", {listTitle: "Work List", listItems: workList});
});

app.listen(port, ()=>{
    console.log(`Server lising at http://localhost:${port}/`);
});