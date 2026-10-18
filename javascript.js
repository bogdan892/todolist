const taskList = [];

class ToDoItem {
  constructor({
    id = crypto.randomUUID(),
    title,
    status = "todo",
    startDate = new Date(),
    endDate = null,
  }) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  toggleStatus() {
    if (this.status === "todo") {
      this.status = "done";
      this.endDate = new Date();
      return;
    }

    this.status = "todo";
    this.endDate = null;
  }
}

class TaskTemplate {
  constructor(task) {
    this.task = task;
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    element.classList.add(...className.split(" "));
    return element;
  }

  formatDate(date) {
    return new Date(date).toLocaleString("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  render() {
    const item = this.createElement("li", "list-group-item");

    item.dataset.id = this.task.id;
    item.dataset.status = this.task.status;

    item.append(
      this.createIndicator(),
      this.createTitle(),
      this.createStartDate(),
      this.createEndDate(),
    );

    return item;
  }

  createIndicator() {
    const className =
      this.task.status === "done" ? "status-done" : "status-todo";

    const indicator = this.createElement(
      "span",
      `status-indicator ${className}`,
    );

    return indicator;
  }

  createTitle() {
    const title = this.createElement("span", "task-text");
    title.textContent = this.task.title;

    if (this.task.status === "done") {
      title.classList.add("text-decoration-line-through", "text-muted");
    }

    return title;
  }

  createStartDate() {
    const date = this.createElement("span", "date start-date");
    date.textContent = this.formatDate(this.task.startDate);

    return date;
  }

  createEndDate() {
    const date = this.createElement("span", "date end-date");

    date.textContent = this.task.endDate
      ? `Завершено: ${this.formatDate(this.task.endDate)}`
      : "";

    return date;
  }
}

class TodoList {
  constructor(element) {
    this.element = element;
  }

  add(task) {
    taskList.push(task);
    this.render();
  }

  toggleTask(id) {
    const task = taskList.find((item) => item.id === id);

    if (!task) return;

    task.toggleStatus();
    this.render();
  }

  render() {
    this.element.replaceChildren();

    const fragment = document.createDocumentFragment();

    taskList.forEach((task) => {
      fragment.append(new TaskTemplate(task).render());
    });

    this.element.append(fragment);
  }
}

class TodoApp {
  constructor() {
    this.taskList = new TodoList(document.getElementById("taskList"));

    this.taskForm = document.getElementById("taskForm");
    this.taskInput = document.getElementById("taskInput");

    this.init();
  }

  init() {
    this.taskForm.addEventListener("submit", (event) => {
      this.handleSubmit(event);
    });

    this.taskList.element.addEventListener("click", (event) => {
      this.handleTaskClick(event);
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const title = this.taskInput.value.trim();

    if (!title) return;

    this.taskList.add(
      new ToDoItem({
        title,
        status: "todo",
        startDate: new Date(),
      }),
    );

    this.taskInput.value = "";
  }

  handleTaskClick(event) {
    const item = event.target.closest(".list-group-item");

    if (!item || !this.taskList.element.contains(item)) return;

    this.taskList.toggleTask(item.dataset.id);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TodoApp();
});
