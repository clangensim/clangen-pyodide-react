import { useEffect } from "react";
import BasePage from "../layout/BasePage";

function CreditsPage() {
  useEffect(() => {
    document.title = "Credits | Clangen Simulator";
  }, []);

  return (
    <BasePage>
      <h1>Credits</h1>
      <p>
        This site incorporates work from Clangen (Clan Generator),
        which is licensed under the Mozilla Public License 2.0. Clangen source
        code and credits can be found{" "}
        <a href="https://github.com/ClanGenOfficial/clangen">here</a>.
        The source code for the fork of Clangen used in this site can be found{" "}
        <a href="https://github.com/clangensim/clangen-lite/tree/clangen-lite">here</a>.
      </p>

      <p>
        The following images used in this software are by the Clangen
        team and are licensed under{" "}
        <a href="https://creativecommons.org/licenses/by-nc/4.0/">
          CC BY-NC 4.0
        </a>
        :
      </p>
      <ul>
        <li>agouticolours.png</li>
        <li>marbledcolours.png</li>
        <li>aprilfoolslineart.png</li>
        <li>maskedcolours.png</li>
        <li>aprilfoolslineartdead.png</li>
        <li>medcatherbs.png</li>
        <li>aprilfoolslineartdf.png</li>
        <li>missingscars.png</li>
        <li>bellcollars.png</li>
        <li>nyloncollars.png</li>
        <li>bengalcolours.png</li>
        <li>rosettecolours.png</li>
        <li>bowcollars.png</li>
        <li>scars.png</li>
        <li>classiccolours.png</li>
        <li>shadersnewwhite.png</li>
        <li>collars.png</li>
        <li>singlecolours.png</li>
        <li>eyes.png</li>
        <li> singlestripecolours.png</li>
        <li>eyes2.png</li>
        <li>skin.png</li>
        <li>fadedarkforest.png</li>
        <li>smokecolours.png</li>
        <li>fademask.png</li>
        <li>sokokecolours.png</li>
        <li>fadestarclan.png</li>
        <li>speckledcolours.png</li>
        <li>lightingnew.png</li>
        <li>tabbycolours.png</li>
        <li>lineart.png</li>
        <li>tickedcolours.png</li>
        <li>lineartdead.png</li>
        <li>tortiepatchesmasks.png</li>
        <li>lineartdf.png</li>
        <li>whitepatches.png</li>
        <li>mackerelcolours.png</li>
        <li>gen_med_newmed.png</li>
        <li>greenleaf_camp1_light.png</li>
        <li>pln_UFO.png (edited to remove the UFO)</li>
      </ul>
    </BasePage>
  );
}

export default CreditsPage;
