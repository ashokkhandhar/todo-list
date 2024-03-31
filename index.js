import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import _ from 'lodash';
import 'dotenv/config'

const app = express();
const port = 3000;

// middlewares

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// db connections

mongoose.connect(process.env.URI)
.then(() => console.info("DB Connected"))
.catch((error) => console.info(`DB Connection error: ${error.message}`));

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "item must have text content."],
    },
});
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema],
});

const List = mongoose.model("list", listSchema);
const Item = mongoose.model("item", itemSchema);

app.get("/", async (req, res) => {
    try {
        const response = await List.find();
        res.render("index.ejs", {lists: response});
    } catch (error) {
        res.send(error.message);
    }
});

app.post("/newList", async (req, res) => {
    const newListName = _.capitalize(req.body.listName);
    try {
        const response = await List.findOne({name: newListName});
        if(response === null) {
            const newItem = new List({
                name: newListName,
                items: [],
            });
            try {
                const response = await newItem.save();
                console.log("Sucessfully created new list..!\n", response);
                res.redirect(`/${newListName}`);
            } catch (error) {
                res.send(error.message);
            }
        }
        else {
            res.redirect(`/${newListName}`);
        }
    } catch(error) {
        res.send(error.message);
    }
});

app.get("/:listName", async (req, res) => {
    const listName = req.params.listName;
    try {
        const list = await List.find({name: listName});
        const lists = await List.find();
        res.render("index.ejs", {lists: lists, list: list[0]});
    } catch (error) {
        res.send(error.message);
    }
});

app.post("/deleteList", async (req, res) => {
    const listName = req.body.listName;
    try {
        const response = await List.deleteOne({name: listName});
        console.log(response);
        res.redirect("/");
    } catch (error) {
        res.send(error.message);
    }
});

app.post("/newItem", async (req, res) => {
    const itemName = req.body.itemName;
    const listName = req.body.listName;
    const newItem = new Item({
        name: itemName,
    });
    try {
        const list = await List.findOne({name: listName});
        list.items.push(newItem);
        const response = await list.save();
        console.log("Sucessfully created new item..!\n", response);
        res.redirect(`/${listName}`);
    } catch (error) {
        res.send(error.message);
    }
});

app.post("/deleteItem", async (req, res) => {
    const listName = req.body.listName;
    try {
        const response = await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: req.body.itemId}}});
        console.log(response);
        res.redirect(`/${listName}`);
    } catch (error) {
        res.send(error.message);
    }
});

app.listen(port, ()=>{
    console.log(`Server lising at http://localhost:${port}/`);
});