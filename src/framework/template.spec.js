import { resolveTemplate as t } from './template';
import { FC } from '.';

describe('template resolver', () => {
  it('resolves template string to a node', () => {
 
    const interp = 'A';

    const App = FC(() => '');


    const node = t`
      <${App} page="page name" extra=${interp} func=${() => console.log('this is a func prop')}/>
      <div class="divclass">textNode</div>
    `;
    expect(node).toEqual(
      [
        {
          props: {
            page: "page name",
            extra: "A",
            func: "" 
          },
          children: []
        },
        {
          props: {
            class: "divClass"
          },
          children: [
            "textNode"
          ]
        }
      ]
    )
  });
})