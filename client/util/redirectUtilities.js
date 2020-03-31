import Router from "next/router";

export default class RedirectUtilities {  
    static async Redirect(context, target) {
    if (context.res) {
        // server
        // 303: "See other"
        context.res.writeHead(303, { Location: target });
        context.res.end();
        } else {
        Router.replace(target);
        }
    }
  }