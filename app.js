const express = require('express')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.json())



app.locals.title = 'trapper-keeper';
const mockList = { title: 'example', id: 1, listItems: [{ id: 111, text: 'example list item' }] }

app.locals.notes = [mockList];

app.use(express.json());

app.get('/api/v1/notes', (request, response) => {
  response.status(200).json(app.locals.notes)
})

app.get('/api/v1/notes/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const matchingNotes = app.locals.notes.find(keep => keep.id === id)
  return response.status(200).json(matchingNotes)
})

app.post('/api/v1/notes', (request, response) => {
  const {title, listItems} = request.body
  if (!title || !listItems) return response.status(422).json('please provide a title and listItems')
  const listItemsWithId = listItems.map((item) => {
    if (item.text) {
      return {text: item.text, id: Date.now()}
    }
  })
  const newNote = {
    id: Date.now(),
    title,
    listItems: listItemsWithId
  }
  app.locals.notes.push(newNote)
  response.status(201).json(newNote)
})

app.patch('/api/v1/notes/:id', (request, response) => {
  const {title, listItems} = request.body
  // console.log(listItems)
  const id = parseInt(request.params.id)
  let noteWasFound = false
  let updatedNotes = app.locals.notes.map((note) => {
    if (note.id === id) {
      noteWasFound = true;
      return {id, title, listItems}
    }
  })

  if(!title || !listItems) return response.status(422).json('please enter a title and listItems')
  if (!noteWasFound) return response.status(404).json('Note not found');

  app.locals.notes = updatedNotes;
  return response.status(204).json();
})

module.exports = app;