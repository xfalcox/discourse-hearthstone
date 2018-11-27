// https://stackoverflow.com/a/6969486
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function cardRegex() {
  return new RegExp(window.cards.map((c) => escapeRegExp(c.name)).join("|"));
}

export function setup(helper) {
   if(!helper.markdownIt) { return; }

   helper.registerOptions((opts,siteSettings)=>{
     opts.features.hearthstone = !!siteSettings.discourse_hearthstone_enabled;
   });

   helper.whiteList(['span.hearthstone-card']);

   helper.registerPlugin(md=>{
     md.core.textPostProcess.ruler.push('cardmention', {
       matcher: cardRegex(),  //regex flags are NOT supported
       onMatch: function(buffer, matches, state) {

         let cardID = window.cards.find((e) => e.name === matches[0]).id;
         let tooltip = `<img src="https://art.hearthstonejson.com/v1/render/latest/enUS/512x/${cardID}.png"></img>`;

         let tag = "span";
         let className = "hearthstone-card";

         let token = new state.Token("card_open", tag, 1);
         token.attrs = [["class", className]];
         token.attrs.push(["data-html-tooltip", tooltip]);

         buffer.push(token);

         token = new state.Token("text", "", 0);
         token.content = matches[0];

         buffer.push(token);

         token = new state.Token("card_close", tag, -1);
         buffer.push(token);

        }
     });
   });
}
