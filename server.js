const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for notesPage
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for /api/notes
app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/db/db.json'))
);

// GET Route for /api/notes/:id  (GET note by id)
app.get('/api/notes/:id', (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  res.json(savedNotes[Number(req.params.id)]);
});

// POST Route for /api/notes (create new note)
app.post('/api/notes', (req, res) => {
  console.log('POST received, req = ', req.body);
  let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  let incomingNote = req.body;
  let newId = savedNotes.length.toString();
  incomingNote.id = newId;
  savedNotes.push(incomingNote);

  fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));
  res.json(savedNotes);
});


// default GET route (if the above get route doesnt match then this will be default)
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
