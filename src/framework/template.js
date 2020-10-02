import { Component } from './component';
import { getId } from './uuid';

export const resolveTemplate = (strings, ...args) => (props, component) => {
  let template = "";
  
  strings.forEach((fragment, i) => {
    const interpolation = args[i];
    
    if (interpolation instanceof Component) {
      const id = `component-${getId()}`;
      template += fragment + `<slot id=${id}></slot>`

      component.onMount((parentComponentElem, parentProps) => {
        const elem = parentComponentElem.querySelector(`#${id}`);
        interpolation.mount(elem);
      });

    } else {
      template += fragment + (interpolation || ''); 
    };
  });

  return template;
};

export const template = (string) => (props) => {
  
}