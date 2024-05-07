function createElement(tag, attributes, children, eventListeners) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  if (eventListeners) {
    Object.keys(eventListeners).forEach((event) => {
      element.addEventListener(event, eventListeners[event]);
    });
  }

  return element;
}

class Component {
  constructor() {
    this._domNode = null;
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    const newDomNode = this.render();
    this._domNode.parentNode.replaceChild(newDomNode, this._domNode);
    this._domNode = newDomNode;
  }
}

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [
        { id: 1, text: "Сделать домашку", completed: false },
        { id: 2, text: "Сделать практику", completed: false },
        { id: 3, text: "Пойти домой", completed: false }
      ],
      newTaskInput: ""
    };
    this.onAddTask = this.onAddTask.bind(this);
    this.onAddInputChange = this.onAddInputChange.bind(this);
    this.toggleTaskCompletion = this.toggleTaskCompletion.bind(this);
    this.removeTask = this.removeTask.bind(this);
  }

  onAddTask() {
    const { todos, newTaskInput } = this.state;
    const newTodo = { id: todos.length + 1, text: newTaskInput, completed: false };
    this.setState({ todos: [...todos, newTodo], newTaskInput: "" });
    this.update();
  }

  onAddInputChange(event) {
    this.setState({ newTaskInput: event.target.value });
  }

  toggleTaskCompletion(todoId) {
    const { todos } = this.state;
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    this.setState({ todos: updatedTodos });
    this.update();
  }

  removeTask(todoId) {
    const { todos } = this.state;
    const updatedTodos = todos.filter(todo => todo.id !== todoId);
    this.setState({ todos: updatedTodos });
    this.update();
  }

  render() {
    const { todos, newTaskInput } = this.state;

    const todoItems = todos.map(todo => (
      createElement("li", { key: todo.id, style: { color: todo.completed ? "gray" : "black" } }, [
        createElement("input", {
          type: "checkbox",
          checked: todo.completed,
          onchange: () => this.toggleTaskCompletion(todo.id)
        }),
        createElement("label", {}, todo.text),
        createElement("button", { onclick: () => this.removeTask(todo.id) }, "🗑️")
      ])
    ));

    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      createElement("div", { class: "add-todo" }, [
        createElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
          value: newTaskInput,
          oninput: this.onAddInputChange
        }),
        createElement("button", { id: "add-btn", onclick: this.onAddTask }, "+"),
      ]),
      createElement("ul", { id: "todos" }, todoItems),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
