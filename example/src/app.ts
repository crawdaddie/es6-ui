import { FC } from '../../src/component';
import { resolveTemplate as t } from '../../src/template'


const Button = FC(({ onClick, text }, { listen }) => {
  listen('click', onClick);
  return t`
    <button>${text}</button>
  `;
});

const Input = FC(({ }, { listen }) => {
  listen('input', e => console.log(e.target.value))
  return t`
    <input></input>
  `
});

const AddItem = FC(({ }, { listen }) => {
  const addItem = () => {
    console.log('add item');
  }
  return t`
    <div>
      ${Input()}
      ${Button({ text: 'add', onClick: addItem })}
    </div>
  `
})

const ListItem = FC(({ text, checked }) => {
  if (checked) {
    text = `<del>${text}</del>`;
  };

  return t`
    <li>
      <input type="checkbox"/> ${text}
    </li>
  `;
})

const TodosList = FC(
  ({ todos }) => t`
    <ul>
      ${todos.map((todo) => t`<li>${todo}</li>`)}
    </ul>
  `
);

const App = FC(() => {
  const heading = "My Todos";
  const todos = ["Swim", "Climb", "Jump", "Play"];

  const addItem = () => { };


  return t`
    <h1>${heading}</h1>
    <${TodosList} todos=${todos}/>
  `;
});
export default App
