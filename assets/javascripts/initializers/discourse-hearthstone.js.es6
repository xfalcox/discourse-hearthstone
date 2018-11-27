import { withPluginApi } from "discourse/lib/plugin-api";
import { registerTooltip } from "discourse/lib/tooltip";

function initializeDiscourseHearthstone(api) {
  api.decorateCooked($elem => {
    registerTooltip($("span.hearthstone-card", $elem));
  });
}

export default {
  name: "discourse-hearthstone",

  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");
    if (siteSettings.discourse_hearthstone_enabled) {
      withPluginApi("0.8.8", initializeDiscourseHearthstone);
    }
  }
};
