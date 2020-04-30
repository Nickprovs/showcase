export default class EmbedUtilities {
  //Loads all embed helpers...
  static async loadAllAvailableEmbedHelpers() {
    if (!window) return;
    this.loadInstagramEmbedHelper();
  }

  static async loadInstagramEmbedHelper() {
    if (window && window.instgrm) window.instgrm.Embeds.process();
  }
}
