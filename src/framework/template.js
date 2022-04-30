const mergeStringsWithArgs = (strings, interpolationArgs) => {
  let arr = [];

  for (let i = 0; i < strings.length; i++) {
    const fragment = (
      strings[i].replace('\n', '')
        .split(/(\/>)|(<\/)|(<)|(>)/)
        .flatMap(f => f?.trim().split(/\s(?=(?:[^'"`]*(['"`]).*?\1)*[^'"`]*$)/))
        .flatMap(f => f?.split(/=(?=(?:[^'"`]*(['"`]).*?\1)*[^'"`]*$)/))
        .map(f => f?.replace(/(^"|"$)/g, ''))
        .filter(f => f && f.trim() !== '')
    );
    console.log(arr, fragment)

    arr.push(fragment);

    if (interpolationArgs[i]) {
      arr.push(interpolationArgs[i])
    }
  };
  return arr.flat();
};



const getAttrs = (tokens, i) => {
  const attrs = [];
  const endIndex = tokens.slice(i).findIndex(a => a === ">" || a === "/>")
  for (let j = i; j < i + endIndex; j++) {
    attrs.push(tokens[j])
  }
  return [attrs, i + endIndex]
};

export const resolveTemplate = (strings, ...args) => {
  const merged = mergeStringsWithArgs(strings, args);
  // console.log(merged)
  let stack = [];

  let tree = [];
  let currentNode = { props: {} };
  let i = 0;
  while (i < merged.length) {
    const token = merged[i];
    if (typeof token === 'string' && token === '<') {

      i++;
      const constructor = merged[i];

      i++;
      const [attrs, j] = getAttrs(merged, i)
      i = j - 1

      let props = {}

      for (const k in attrs) {
        if (k % 2 !== 0) {
          const propName = attrs[k - 1];
          props[propName] = attrs[k]
        }
      }
      stack.push({
        constructor,
        props
      })

    } else if (token === '>') {
      // add to stack
    } else if (token === '/>') {
      const last = stack.pop();
      const parent = stack[stack.length - 1]
      stack[stack.length - 1].children = [...parent.children, last]
      console.log(token, stack)
    }
    i++;
  }

  console.log(stack)


  return tree;
}
