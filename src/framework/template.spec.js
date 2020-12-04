import { resolveTemplate as t } from './template';
import { FC } from '.';

describe('template resolver', () => {
  it('resolves template string to a node', () => {
 
    const interp = 'A';

    const App = FC((page, extra, func) => {
      return t``
    });

    const Component = FC((prop1) => {
      return t``
    });

    const functionRef = () => console.log('this is a func prop');
    const node = t`
      <${App} page="page name" extra=${interp} func=${functionRef}>
        <${Component} prop1="prop" />
      </${App}>
      <div class="divclass">text</div>
    `;

    console.log(node);
    expect(node).toEqual(
      [
        {
          type: "component",
          constructor: App,
          props: {
            page: "page name",
            extra: "A",
            func: functionRef, 
          },
        },

        {
          type: "div",
          props: {
            class: "divclass"
          },          
          children: [
            "text"
          ]
        }
      ]
    )
  });
})