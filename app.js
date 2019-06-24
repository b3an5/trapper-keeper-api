const express = require("express");
const cors = require("cors");

const app = express();
//assign app as var in express

app.use(cors());
//Cross Origin Resourse Sharing, lets browser know its ok

app.use(express.json());
//parses request by default

app.locals.title = "trapper-keeper";
//sets title of app

const mockList = {
  title: "example",
  id: 1,
  listItems: [{ id: 111, text: "example list item", completed: false }]
};
//mock data

app.locals.notes = [mockList];
//saves mock data to app.locals

app.get("/api/v1/notes", (request, response) => {
  response.status(200).json(app.locals.notes);
});
//get method gives you a sucessful statuscode and gives json data of app local notes

app.get("/api/v1/notes/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const matchingNote = app.locals.notes.find(note => note.id === id);
  if (!matchingNote) return response.status(404).json("Note not found");
  //failure code that it gives if no note was found
  return response.status(200).json(matchingNote);
});
//get method gives you a sucessful statuscode and gives json data of app local notes of the specific note

app.post("/api/v1/notes", (request, response) => {
  //allows user to upload a note
  const { title, listItems } = request.body;
  //destructure
  if (!title || !listItems)
    return response.status(422).json("please provide a title and listItems");
  //conditional for if there isnt a title or list items in the request give error code
  const listItemsWithId = listItems.map((item, i) => {
    if (item.text) {
      return {
        text: item.text,
        completed: false,
        id: Math.floor(Math.random() * 100000)
      };
    }
  });
  //gives each list item an id
  const newNote = {
    id: Math.floor(Math.random() * 100000),
    title,
    listItems: listItemsWithId
  };
  //gives note an id
  app.locals.notes.push(newNote);
  //pushes new note into app.locals
  response.status(201).json(newNote);
  //happy path status
});

app.patch("/api/v1/notes/:id", (request, response) => {
  //allows user to edit note uses patch bc it keeps same id.
  const { title, listItems } = request.body;
  //destructure
  const id = parseInt(request.params.id);
  //takes note id and parses it to use in conditional
  let noteWasFound = false;
  //defaults to note being not found
  let updatedNotes = app.locals.notes.map(note => {
    if (note.id === id) {
      noteWasFound = true;
      //updates the note was found conitional
      return { id, title, listItems };
      //updates the note
    } else {
      return note;
    }
  });

  if (!title || !listItems)
    return response.status(422).json("please enter a title and listItems");
  //status if there isnt a title and listitems for front end dev
  if (!noteWasFound) return response.status(404).json("Note not found");
  //if the id doesnt match

  app.locals.notes = updatedNotes;
  return response.status(200).json("updated");
  //happy path
});

app.delete("/api/v1/notes/:id", (request, response) => {
  //delete note
  const id = parseInt(request.params.id);
  const index = app.locals.notes.findIndex(note => note.id == id);

  if (index === -1) return response.status(404).json("Note not found");

  app.locals.notes.splice(index, 1);
  return response.status(200).json("deleted");
  //should have used a filter here but we used a splice to take the specific index out of app. locals
});

module.exports = app;
