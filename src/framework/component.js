import { stringToHTML, diff } from './dom';
import { dataProxy } from './proxy';

export class Component {
  constructor(options) {
    this._data = dataProxy(options.data || {}, this);
    this.state = {};
    this.mountListeners = [];
    this.template = options.template(this.data, {
      onMount: (cb) => this.onMount(cb),
      listen: (event, cb) => {
        this.onMount(elem => elem.addEventListener(event, cb))
      },
      useState: (object) => {

        this.state[object] = object;
        const setState = (newState) => {
          // this.setState({ object: newState });
        };

        // return [state, setState]

        return [state, setState]
      },
    });
  }

  get data() {
    return this._data
  }

  set data(data) {
    this._data = dataProxy(data, this);
    return true;
  }

  setState(newState) {

  }

  mount(elem) {
    this.elem = elem;
    const render = this.render();
    this.mountListeners.forEach(cb => cb(elem, this.data));
    return render;
  }

  onMount(cb) {
    this.mountListeners.push(cb);
  }

  render() {
    const template = this.template(this.data, this);
    const templateHTML = stringToHTML(template);
    return diff(templateHTML, this.elem, this.data);
  }
}

export const FC = (templateFunction) => (props) => {
  return new Component({
    data: props,
    template: templateFunction,
  });
};

export const mount = (rootElement, component) => {
  component.mount(rootElement);
};
