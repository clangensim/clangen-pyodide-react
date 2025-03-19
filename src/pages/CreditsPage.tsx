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
        This site uses code from and adapted from Clangen (Clan Generator),
        which is licensed under the Mozilla Public License 2.0. Clangen source
        code and credits can be found{" "}
        <a href="https://github.com/ClanGenOfficial/clangen">here</a>.
      </p>

      <p>
        <a href="https://github.com/nielssp/classic-stylesheets">
          Classic Stylesheets
        </a>{" "}
        (that's the CSS library that makes this site look like old-school
        Windows!) is by Niels Sonnich Poulsen and licensed under the MIT
        license:
      </p>
      <blockquote>
        <p>MIT License</p>

        <p>Copyright (c) 2022 Niels Sonnich Poulsen (http://nielssp.dk)</p>

        <p>
          Permission is hereby granted, free of charge, to any person obtaining
          a copy of this software and associated documentation files (the
          "Software"), to deal in the Software without restriction, including
          without limitation the rights to use, copy, modify, merge, publish,
          distribute, sublicense, and/or sell copies of the Software, and to
          permit persons to whom the Software is furnished to do so, subject to
          the following conditions:
        </p>

        <p>
          The above copyright notice and this permission notice shall be
          included in all copies or substantial portions of the Software.
        </p>

        <p>
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
          IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
          CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
          TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
          SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </p>
      </blockquote>
      <p>
        The following images used in this software are by the Clan Generator
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
      </ul>
    </BasePage>
  );
}

export default CreditsPage;
