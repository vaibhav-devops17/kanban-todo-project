const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const sanitizer = require('sanitizer');
const app = express();
const port = 8000;

// Task array with `text` and `status`
let tasks = [
  { text: "Buy groceries", status: "todo" },
  { text: "Build todo app", status: "inprogress" },
  { text: "Deploy to server", status: "done" }
];

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));

// ✅ Display Kanban board
app.get('/todo', function (req, res) {
  res.render('todo.ejs', {
    todolist: tasks,
    clickHandler: "func1();"
  });
});

// ✅ Add new task to "To Do"
app.post('/todo/add/', function (req, res) {
  const newTodoText = sanitizer.escape(req.body.newtodo);
  if (newTodoText !== '') {
    tasks.push({ text: newTodoText, status: "todo" });
  }
  res.redirect('/todo');
});

// ✅ Delete task
app.get('/todo/delete/:id', function (req, res) {
  const id = parseInt(req.params.id);
  if (!isNaN(id) && tasks[id]) {
    tasks.splice(id, 1);
  }
  res.redirect('/todo');
});

// ✅ Render edit form
app.get('/todo/:id', function (req, res) {
  const todoIdx = req.params.id;
  const task = tasks[todoIdx];

  if (task) {
    res.render('edititem.ejs', {
      todoIdx,
      todo: task.text, // Send only text to EJS
      clickHandler: "func1();"
    });
  } else {
    res.redirect('/todo');
  }
});

// ✅ Handle edited task
app.put('/todo/edit/:id', function (req, res) {
  const id = parseInt(req.params.id);
  const editTodo = sanitizer.escape(req.body.editTodo);

  if (!isNaN(id) && editTodo !== '') {
    tasks[id].text = editTodo;
  }
  res.redirect('/todo');
});

// ✅ Update task status (todo → inprogress → done)
app.post('/todo/update-status/:id', function (req, res) {
  const id = parseInt(req.params.id);
  const newStatus = sanitizer.escape(req.body.status);

  if (!isNaN(id) && tasks[id] && ['todo', 'inprogress', 'done'].includes(newStatus)) {
    tasks[id].status = newStatus;
  }
  res.redirect('/todo');
});

// ✅ Fallback route
app.use(function (req, res) {
  res.redirect('/todo');
});

// Start server
app.listen(port, function () {
  console.log(`Kanban Todolist running on http://0.0.0.0:${port}`);
});

module.exports = app;
