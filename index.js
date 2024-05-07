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
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }
}

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [
        { id: 1, text: "Сделать домашку" },
        { id: 2, text: "Сделать практику" },
        { id: 3, text: "Пойти домой" }
      ],
      newTaskInput: ""
    };
    this.onAddTask = this.onAddTask.bind(this);
    this.onAddInputChange = this.onAddInputChange.bind(this);
  }

  onAddTask() {
    const { todos, newTaskInput } = this.state;
    const newTodo = { id: todos.length + 1, text: newTaskInput };
    this.setState({ todos: [...todos, newTodo], newTaskInput: "" });
  }

  onAddInputChange(event) {
    this.setState({ newTaskInput: event.target.value });
  }

  render() {
    const { todos, newTaskInput } = this.state;

    const todoItems = todos.map(todo => (
      createElement("li", { key: todo.id }, [
        createElement("input", { type: "checkbox" }),
        createElement("label", {}, todo.text),
        createElement("button", {}, "🗑️")
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
          oninput: this.onAddInputChange // Навешиваем событие изменения на метод onAddInputChange
        }),
        createElement("button", { id: "add-btn", onclick: this.onAddTask }, "+"), // Навешиваем событие клика на метод onAddTask
      ]),
      createElement("ul", { id: "todos" }, todoItems),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
