// import { h, Component, render } from 'preact';
import './styles/main.css';

import { resolveTemplate as t } from './framework/template';

import { createMachine, interpret, assign } from "xstate";
import { TokenTypes } from './framework/template';
class App {
}

const app = () => {
  // const root = document.querySelector('#app');

  // const ht = html`<${App} page="All" />`;
  const interp = 'A'

  const tmp = t`
    <${App} page="sdas A =" extra=${interp} func=${() => console.log('this is a func prop')}/>
    <div class="divclass">textNode</div>
  `;

  console.log(createMachine({
    initial: 'initial',
    states: {
      initial: {
        on: {
          [TokenTypes.TAG_START]: 'tag_assignment'
        }

      },
      tag_assignment: {
        on: { }
      }
    }
  }))

  // console.log(tmp);

  // render(ht, root);
};
app();
