import { addHook } from "isomorphic-dompurify";

export default function initializeDomPurify() {
  addHook("uponSanitizeElement", function (currentNode, hookEvent, config) {
    if (currentNode && currentNode.tagName && currentNode.tagName.toUpperCase() === "iframe".toUpperCase())
      console.log("Found an iframe", currentNode.attributes.src);

    // Do something with the current node and return it
    // You can also mutate hookEvent (i.e. set hookEvent.forceKeepAttr = true)
    return currentNode;
  });
}
