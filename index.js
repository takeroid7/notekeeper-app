const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// In-memory storage
let notes = [];
let nextId = 1;

// GET /notes - Get all notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// POST /notes - Create a new note
app.post("/notes", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const newNote = {
    id: nextId++,
    title,
    content,
    createdAt: new Date().toISOString(),
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

// GET /notes/:id - Get a note by ID
app.get("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find((n) => n.id === id);

  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  res.json(note);
});

// PUT /notes/:id - Update a note
app.put("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  const noteIndex = notes.findIndex((n) => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  notes[noteIndex] = {
    ...notes[noteIndex],
    title,
    content,
  };

  res.json(notes[noteIndex]);
});

// DELETE /notes/:id - Delete a note
app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const noteIndex = notes.findIndex((n) => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  const deletedNote = notes.splice(noteIndex, 1)[0];
  res.json({ message: "Note deleted successfully", note: deletedNote });
});

app.use(express.static("public"));

// Start server
app.listen(PORT, () => {
  console.log(`NoteKeeper API server running on port ${PORT}`);
});
