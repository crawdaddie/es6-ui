import { Component } from './component';
import { getId } from './uuid';
import { build } from './build';

const merge = (strings, args) => {
  const array = [];
  strings.forEach((fragment, i) => {
    array.push(...fragment.split(/(<|>)/));
    const arg = args[i];
    if (arg) {
      array.push(arg);
    }
  });
  return array;  
}

const isClosingTag = tagToken => typeof tagToken === 'string' && tagToken.indexOf('/') === 0

const getAttributes = (tagTokens, arg) => {

  const isComponent = typeof tagTokens[0] !== 'string';


  const tagName = isComponent ? 'component' : tagTokens[0].split(' ')[0];
  const innerTag = tagTokens.filter(t => t !== '/')[isComponent ? 1 : 0];
  const attrPairs = innerTag.split(
    // /(?=(?:[^"]*"[^"]*")*[^"]*\Z)/
    /("[^"]*")|=/ 
    // /<([^>"]|  )*>/gus
  ).filter(t => t);
  if (attrPairs % 2 !== 0) {
    attrPairs.push(arg)
  };
  console.log(attrPairs.reduce((result, c, i, array) => {
    if (i % 2 === 0) {
      result[c.trim()] = array[i + 1] 
    };
    return result;

  }, {}));


  return {
    type: tagName,
    props: {},
    class: [],
  }
}

const getTag = (tokens, index) => {
  let i = index;
  const nextTokens = tokens.slice(i + 1);
  const tagTokens = [];

  for (const token of nextTokens) {
    if (token === ">") {
      return [ tagTokens, i++ ]
    }

    if (token !== "" && token !== "\n") {
      tagTokens.push(token);
      i++
    }
  } 
}

const processToken = (currentNode, tokensArray, index, level) => {
  const token = tokensArray[index];
  if (token === '<') {
    const [ tagTokens, nextIndex ] = getTag(tokensArray, index);
    
    if (isClosingTag(tagTokens[0])) {
      return [
        currentNode,
        nextIndex,
        level - 1
      ]
    } 
    
    const isSelfClosing = isClosingTag(tagTokens[tagTokens.length - 1]);
    
    return [
      {
        ...currentNode,
        ...getAttributes(tagTokens, tokensArray[nextIndex]),
        isSelfClosing
      },
      nextIndex,
      isSelfClosing ? level : level + 1
    ]
  }

  return [
    currentNode,
    index + 1,
    level
  ]
};

const mergeStringsWithArgs = (strings, args) => {
  const array = [];
  strings.forEach((fragment, i) => {
    array.push(fragment);
    const arg = args[i];
    if (arg) {
      array.push(arg);
    }
  });
  return array;
}


export const TokenTypes = {
  TAG_START: "TAG_START",
  TAG_END: "TAG_END",
  DYNAMIC: "DYNAMIC",
  TEXT: "TEXT",
  ATTR_NAME: "ATTR_NAME",
  ATTR_VALUE: "ATTR_VALUE",
  ATTR_ASSIGNMENT: "ATTR_ASSIGNMENT",
  STRING_VALUE: "STRING_VALUE",
  NODE_END: "NODE_END",
};

const isStringDelimiter = char => char === "\"" || char === "'";

function* streamTokens(allFragments) {
  let buffer = '';
  for (const fragment of allFragments) {
    if (typeof fragment !== 'string') {
      yield { type: TokenTypes.DYNAMIC, value: fragment };
    } else if (fragment.search(/^[^<>\/"'=]+$/) > -1) {
      yield { type: TokenTypes.ATTR_VALUE, value: fragment };
    } else {
      let i = 0;
      while (i < fragment.length) {
        const char = fragment[i];
        if (char === '<') {
          buffer = "";
          yield { type: TokenTypes.TAG_START }

        } else if (char === '>') {
          yield { type: TokenTypes.TAG_END }
          
        } else if (char === '/') {
          yield { type: TokenTypes.NODE_END }

        } else if (char === '=') {
          const value = buffer.trim();
          if (value !== "") {
            yield { type: TokenTypes.ATTR_NAME, value };
          }
          buffer = "";
        
        } else if (char === ' ') {
          const value = buffer.trim();
          if (value !== "") {
            yield { type: TokenTypes.ATTR_VALUE, value };
          };
          buffer = "";

        } else if (isStringDelimiter(char)) {
          buffer = "";
          let strChar = "";

          while(strChar !== char) {
            i++
            buffer += strChar;
            strChar = fragment[i];
          }

          yield { type: TokenTypes.ATTR_VALUE, value: buffer };
          buffer = "";
        
        } else {
          buffer += char;
        }
        i++;
      }
    }
  }
}


const modes = {
  ATTR_ASSIGNMENT: "ATTR_ASSIGNMENT",
  TAG_ASSIGNMENT: "TAG_ASSIGNMENT",
};


export const resolveTemplate = (strings, ...args) => {
  const merged = mergeStringsWithArgs(strings, args);
  const tree = [];
  let currentNode = {};

  let mode;
  let previousToken;
  for (const token of streamTokens(merged)) {
    console.log(token);
    switch (token.type) {
      case TokenTypes.TAG_START: {
        currentNode = {props: {}};
        mode = modes.TAG_ASSIGNMENT
        break;
      }
      case TokenTypes.ATTR_NAME: {
        mode = modes.ATTR_ASSIGNMENT;
        break;
      }
      case TokenTypes.ATTR_VALUE: {
        if (mode === modes.ATTR_ASSIGNMENT) {
          currentNode.props[previousToken.value] = token.value;
          break;
        }

        if (mode === modes.TAG_ASSIGNMENT) {
          currentNode.type = token.value
          break;
        }
        break;
      }

      case TokenTypes.DYNAMIC: {
        if (mode === modes.TAG_ASSIGNMENT) {
          currentNode.type = 'component';
          currentNode.constructor = token.value;
          break;
        }

        if (mode === modes.ATTR_ASSIGNMENT) {
          currentNode.props[previousToken.value] = token.value;
          break;
        }
        break;
      }
      case TokenTypes.STRING_VALUE: {
        if (mode === modes.ATTR_ASSIGNMENT) {
          currentNode.props[previousToken.value] = token.value;
        }
        break;
      }
      case TokenTypes.NODE_END: {
        // mode = previousToken.type === TokenTypes.TAG_START ? modes.CLOSE_ 
        if (previousToken.type === TokenTypes.TAG_END) {
          break;
        }


        break;

      }
      case TokenTypes.TAG_END: {
        if (previousToken.type === TokenTypes.NODE_END) {
          break;
        }
        break;
      }
    };
    previousToken = token;
    console.log(currentNode);
  }
  
  return tree;

}