import { FC, resolveTemplate as t, mount } from './framework';
import './styles/main.css';

const Button = FC(({onClick, text}, {listen}) => {
  listen('click', onClick);
  return t`
    <button>${text}</button>
  `;
});

const Input = FC(({}, { listen }) => {
  listen('input', e => console.log(e.target.value))
  return t`
    <input></input>
  `
});

const ListItem = FC(({text}) => {
  return t`
    <li>${text}</li>
  `;
})



const App = FC(({}, { useState }) => {
  const heading = "My Todos";
  const [todos, setTodos] = useState(["Swim", "Climb", "Jump", "Play"]);


  const addItem = () => setTodos([...todos, Math.random().toString(36).substring(7)]);
  
  const removeItem = (e) => {
    // setTodos(todos.slice(0, todos.length - 1))
  };


  return t`
    <h1>${heading}</h1>
    ${Input()}
    ${Button({
      text: "add",
      onClick: addItem
    })}
    ${Button({
      text: "remove",
      onClick: removeItem,
    })}
    ${Button({
      text: "my button",
      onClick: () => console.log("click component button"),
    })}
    <ul>
      ${todos.map(todo => ListItem({ text: todo }))}
    </ul>
  `;
});

const app = () => {
  const root = document.querySelector('#app');
  const appComponent = App();
  appComponent.mount(root);
};

app();
