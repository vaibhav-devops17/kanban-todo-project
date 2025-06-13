let tasks = [
  { text: "Sample Task 1", status: "todo" },
  { text: "Sample Task 2", status: "inprogress" }
];

app.get("/todo", (req, res) => {
  res.render("todo", { tasks });
});

app.post("/todo/add", (req, res) => {
  tasks.push({ text: req.body.newtodo, status: "todo" });
  res.redirect("/todo");
});

app.get("/todo/:id", (req, res) => {
  const id = req.params.id;
  res.render("edititem", { task: tasks[id], todoIdx: id });
});

app.post("/todo/edit/:id", (req, res) => {
  const id = req.params.id;
  tasks[id].text = req.body.editTodo;
  res.redirect("/todo");
});

app.get("/todo/delete/:id", (req, res) => {
  tasks.splice(req.params.id, 1);
  res.redirect("/todo");
});

app.post("/todo/update-status/:id", (req, res) => {
  const id = req.params.id;
  const newStatus = req.body.status;
  tasks[id].status = newStatus;
  res.redirect("/todo");
});
