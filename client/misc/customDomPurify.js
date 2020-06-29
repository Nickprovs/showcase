import { addHook, setConfig } from "isomorphic-dompurify";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const recognizedMarkupDomains = publicRuntimeConfig.recognizedMarkupDomains.split(",").map((domain) => domain.trim());

export default function initializeDomPurify() {
  //Allow scrips and iframes -- but filter them out via hooks unless they meet the criterio
  const customConfig = { ADD_TAGS: ["script", "iframe", "iframe"], FORCE_BODY: true };
  setConfig(customConfig);

  addHook("uponSanitizeElement", function (currentNode, hookEvent, config) {
    //Ignore bum nodes
    if (!currentNode || !currentNode.tagName) return currentNode;

    //Only allow iframes and scripts that have
    //1.) Have a src tag.
    //2.) Src tag is a from a trusted place.
    const tagName = currentNode.tagName.toUpperCase();
    switch (tagName) {
      case "IFRAME":
      case "SCRIPT":
        console.log("in hook");

        const src = currentNode.attributes.src;
        if (!src) currentNode.parentNode?.removeChild(currentNode);
        const srcIsTrusted = recognizedMarkupDomains.some((d) => src.value.toLowerCase().startsWith(d.toLowerCase()));
        if (!srcIsTrusted) {
          console.log("removing untrusted source", currentNode);
          currentNode.parentNode?.removeChild(currentNode);
          console.log("trusted sources ", recognizedMarkupDomains);
        }
        break;
    }
    return currentNode;
  });
}
