import { FC, resolveTemplate as t, mount } from './framework';
import './styles/main.css';

const Button = FC(({onClick, children}, {listen}) => {
  listen('click', onClick);
  return t`
    <button>${children}</button>
  `;
});

const Input = FC(({}, {listen}) => {
  listen('input', e => console.log(e.target.value))
  return t`
    <input></input>
  `
});

const App = FC((props) => {
  const addItem = () =>
    props.todos.push(Math.random().toString(36).substring(7));
  
  const removeItem = (e) => {
    console.log(e);
    const { todos } = props;
    props.todos = todos.slice(0, todos.length - 1)
  };

  return t`
    <h1>${props.heading}</h1>
    ${Input({})}
    ${Button({
      children: "add",
      onClick: addItem
    })}
    ${Button({
      children: "remove",
      onClick: removeItem,
    })}
    ${Button({
      children: "my button",
      onClick: () => console.log("click component button"),
    })}
    <ul>
      ${props.todos
        .map(function (todo) {
          return `<li>${todo}</li>`;
        })
        .join("")}
    </ul>
  `;
});

const app = () => {
  const root = document.querySelector('#app');
  const appComponent = App({
    heading: "My Todos",
    todos: ["Swim", "Climb", "Jump", "Play"],
  });
  mount(root, appComponent)
  // console.log(appComponent);
};

app();



// onMount((elem, props) => {
//   const addBtn = elem.querySelector('#add-todo');
//   addBtn.addEventListener('click', (e) => {
//     props.todos.push(Math.random().toString(36).substring(7));
//   });
//   const removeBtn = elem.querySelector("#remove-todo");
//   removeBtn.addEventListener('click', (e) => {
//     const { todos } = props;
//     props.todos = todos.slice(0, todos.length - 1);
//   });
// });