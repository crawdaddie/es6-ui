export const stringToHTML = (str) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  return doc.body;
};

/**
 * Get the type for a node
 * @param  {Node}   node The node
 * @return {String}      The type
 */
const getNodeType = (node) => {
  if (node.nodeType === 3) return 'text';
  if (node.nodeType === 8) return 'comment';
  return node.tagName.toLowerCase();
};

const isSlotNode = (node) => getNodeType(node) === 'slot';
const areSlotNodes = (domNode, node) => isSlotNode(domNode) && isSlotNode(node);

/**
 * Get the content from a node
 * @param  {Node}   node The node
 * @return {String}      The type
 */
const getNodeContent = (node) => {
  if (node.childNodes && node.childNodes.length > 0) return null;
  return node.textContent;
};

/**
 * Compare the new template to the current DOM and make updates
 * @param  {Node} template The template HTML
 * @param  {Node} elem     The UI HTML
 */
export const diff = (template, elem, props) => {
  const domNodes = elem.childNodes;
  const templateNodes = template.childNodes;

  // If extra elements in DOM, remove them
  let count = domNodes.length - templateNodes.length;
  if (count > 0) {
    for (; count > 0; count--) {
      domNodes[domNodes.length - count].parentNode.removeChild(
        domNodes[domNodes.length - count]
      );
    }
  }

  templateNodes.forEach((node, i) => {
    const domNode = domNodes[i];
    if (!domNode) {
      elem.appendChild(node.cloneNode(true));
      return;
    }

    if (getNodeType(node) !== getNodeType(domNode)) {
      domNode.parentNode.replaceChild(node.cloneNode(true), domNode);
      return;
    }

    // if template has new content, replace it
    const templateContent = getNodeContent(node);
    if (templateContent && templateContent !== getNodeContent(domNode)) {
      domNode.textContent = templateContent;
    }

    // If target element should be empty, wipe it
    if (!(areSlotNodes(domNode, node)) && domNode.childNodes.length > 0 && node.childNodes.length < 1) {
      domNode.innerHTML = "";
      return;
    }

    if (areSlotNodes(domNode, node)) {

    }

    if (domNode.childNodes.length < 1 && node.childNodes.length > 0) {
      const fragment = document.createDocumentFragment();
      diff(node, fragment);
      domNode.appendChild(fragment);
      return;
    }

    if (node.childNodes.length > 0) {
      diff(node, domNode)
    }
  })
  return domNodes;
}
