import { ClanInfo } from "./python/types";

const download = (b: Blob, name: string) => {
  const temp = document.createElement("a");
  temp.href = window.URL.createObjectURL(b);
  temp.download = name;
  document.body.appendChild(temp);
  temp.click();
  document.body.removeChild(temp);
};

const formatText = (s: string) => {
  const TAGS = [/<i>/g, /<\/i>/g, /<b>/g, /<\/b>/g];

  let output = s;
  for (const t of TAGS) {
    output = output.replace(t, "");
  }
  return output;
};

function getSiteTheme() {
  let siteTheme = localStorage.getItem("site-theme");
  if (!siteTheme || siteTheme == "auto") {
    const prefersLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
    siteTheme  = prefersLightMode ? "theme-light" : "theme-dark";
  }

  return siteTheme;
}

function setCustomCss() {
  // set site theme before custom css so it can be overwritten
  document.documentElement.className = getSiteTheme();

  const customCssElement = document.getElementById("custom-css");
  const customCss = localStorage.getItem("custom-css");
  // need the last condition or there will be flash of unstyled content
  if (customCssElement && customCss && customCssElement.textContent !== customCss) {
    customCssElement.textContent = customCss;
  }
}

function getCampBGPath(biome: string, season: string, campNum: string) {
  let lightDark = "light";
  const now = new Date();
  if (now.getHours() <= 5 || now.getHours() >= 17) {
    lightDark = "dark";
  }

  return `camp_bg/${biome.toLowerCase()}/${season.toLowerCase().replace("-", "")}_${campNum}_${lightDark}.png`
}

function getCampBGPathByClan(clanInfo: ClanInfo | null | undefined) {
  if (!clanInfo) {
    return "";
  }
  
  return getCampBGPath(clanInfo?.biome.toLowerCase(), clanInfo?.season.toLowerCase().replace("-", ""), clanInfo?.campBg);
}

export { download, formatText, setCustomCss, getCampBGPath, getCampBGPathByClan };
