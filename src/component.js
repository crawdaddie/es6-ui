import { stringToHTML, diff } from './dom';
import { dataProxy } from './proxy';

export class Component {
  constructor(options) {
    console.log('constructor', options)
    this._data = dataProxy(options.data, this);
    this.mountListeners = [];
    this.templateFunc = options.template;
    this.template = options.template(
      this.data,
      {
        onMount: (cb) => this.onMount(cb),
        listen: (event, cb) => {
          this.onMount(elem => {
            elem.addEventListener(event, cb);
          })
        },
      }
    );
  }

  get data() {
    return this._data
  }

  set data(data) {
    this._data = dataProxy(data, this);
    return true;
  }

  mount(elem) {
    this.elem = elem;
    const tree = this.templateFunc()
    console.log({ tree })
    tree.forEach(({ constructor, props }) => {
      typeof constructor !== 'string' ? constructor(props) : null;
    })
  }

  onMount(cb) {
    this.mountListeners.push(cb);
  }

  render() {
    // console.log(this.data, this.templateFunc)
    // this.elem.append(document.createElement(this.templateFunc[0].constructor).append())
    // console.log(this.templateFunc, this.elem)
    // return this.templateFunc


    // const template = this.template(this.data, this);
    // const templateHTML = stringToHTML(template);
    // return diff(templateHTML, this.elem, this.data);
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
