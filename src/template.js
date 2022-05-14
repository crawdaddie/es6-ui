import { Tokenizer } from 'html-tokenizer'

const mergeStringsWithArgs = (strings, interpolationObjects) => {
  let template = ''
  const objectContext = interpolationObjects.reduce((objs, obj, i) => {
    return { ...objs, [`object-${i}`]: obj }
  }, {})
  for (let i = 0; i < strings.length; i++) {
    template += strings[i].replace('\n', '');
    if (interpolationObjects[i]) {
      template += `object-${i} `
    }
  }

  const tokens = [...Tokenizer.tokenize(template)];
  return { tokens, objectContext }
};



const getAttrs = (tokens, i) => {
  const attrs = [];
  const endIndex = tokens.slice(i).findIndex(a => a === ">" || a === "/>")
  for (let j = i; j < i + endIndex; j++) {
    attrs.push(tokens[j])
  }
  return [attrs, i + endIndex]
};

const isEmptyToken = ({ type, text }) => {
  return type === 'text' && text.replace('\n', '').trim() !== ''
}

export const resolveTemplate = (strings, ...args) => {
  const { tokens, objectContext } = mergeStringsWithArgs(strings, args);
  let stack = [{
    constructor: 'empty-tag',
    children: []
  }];

  let tree = [];
  let currentNode = { props: {} };
  let i = 0;
  while (i < tokens.length) {
    let token = tokens[i]
    if (token.type === 'opening-tag') {
      const constructor = objectContext[token.name.trim()] || token.name;
      stack.push({ constructor })
    }

    if (token.type === 'attribute') {
      const props = stack[stack.length - 1].props || {};
      const val = objectContext[token.value.trim()] || token.value
      stack[stack.length - 1].props = { ...props, [token.name]: val }
    }
    if (token.type === 'opening-tag-end') {
      if (token.token === '/>') {
        const childItem = stack.pop()
        const parent = stack[stack.length - 1]
        stack[stack.length - 1].children = [...parent.children || [], childItem]
      }
    }

    if (token.type === 'closing-tag') {
      const childItem = stack.pop()
      const parent = stack[stack.length - 1]
      stack[stack.length - 1].children = [...parent.children || [], childItem]
    }
    if (token.type === 'text') {
      const childItem = objectContext[token.text.trim()] || token.text;
      const parent = stack[stack.length - 1]
      if (parent && childItem.trim() !== '') {
        stack[stack.length - 1].children = [...parent?.children || [], childItem]
      }

    }
    i++
  }
  console.log(stack[0].children)

  return stack[0].children;
}
