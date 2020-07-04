import { addHook, setConfig } from "isomorphic-dompurify";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const recognizedMarkupDomains = publicRuntimeConfig.recognizedMarkupDomains
  ? publicRuntimeConfig.recognizedMarkupDomains.split(",").map((domain) => domain.trim())
  : [""];

//Used for tags that we may want to include based on the value of their source tag.
const getTagNodeHasSourceFromValidLocation = (node) => {
  //If the tag we want to check doesn't have a source, it's no good.
  const src = node.attributes.src;
  if (!src) return false;

  //See if the soruce is whitelisted
  const srcIsTrusted = recognizedMarkupDomains.some((d) => src.value.toLowerCase().startsWith(d.toLowerCase()));
  if (srcIsTrusted) return true;

  return false;
};

export default function initializeDomPurify() {
  //Allow scrips and iframes -- but filter them out via hooks unless they meet the criterio
  const customConfig = { ADD_TAGS: ["script", "iframe"], FORCE_BODY: true };
  setConfig(customConfig);

  //Only allow iframes and scripts that have
  //1.) Have a src tag.
  //2.) Src tag is a from a trusted place.
  addHook("uponSanitizeElement", function (node, hookEvent, config) {
    //Ignore bum nodes
    if (!node || !node.tagName) return node;

    const tagName = node.tagName.toUpperCase();
    switch (tagName) {
      case "IFRAME":
      case "SCRIPT":
        if (!getTagNodeHasSourceFromValidLocation(node)) node.parentNode?.removeChild(node);
        break;
    }
    return node;
  });

  //Only allow attributes from iframes and scripts that have
  //1.) Have a src tag.
  //2.) Src tag is a from a trusted place.
  addHook("uponSanitizeAttribute", function (node, data) {
    //Ignore bum nodes
    if (!node || !node.tagName) return node;

    const tagName = node.tagName.toUpperCase();
    switch (tagName) {
      case "IFRAME":
      case "SCRIPT":
        if (getTagNodeHasSourceFromValidLocation(node)) data.allowedAttributes[data.attrName] = true;
        break;
    }
  });
}
