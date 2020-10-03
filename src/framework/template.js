import { Component } from './component';
import { getId } from './uuid';

const handleInterpolation = (interpolation, component) => {
  if (interpolation instanceof Array) {
    return interpolation.map(
      subComponent => handleInterpolation(
        subComponent,
        component)
      ).join('');
  }

  if (interpolation instanceof Component) {
    const id = `component-${getId()}`;
    component.onMount((parentComponentElem, parentProps) => {
      const elem = parentComponentElem.querySelector(`#${id}`);
      interpolation.mount(elem);
    });

    return `<slot id=${id}></slot>`;
  }
  return interpolation || "";
};

export const resolveTemplate = (strings, ...args) => (props, component) => {
  let template = "";
  strings.forEach((fragment, i) => {
    const interpolation = args[i];
    template += fragment + handleInterpolation(interpolation, component, fragment);
  });

  return template;
};
