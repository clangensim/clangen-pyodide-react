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

  var output = s;
  for (const t of TAGS) {
    output = output.replace(t, "");
  }
  return output;
};

function getSiteTheme() {
  let siteTheme = localStorage.getItem("site-theme");
  if (!siteTheme || siteTheme == "auto") {
    let prefersLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
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

function getCampBGPath(clanInfo: ClanInfo | null | undefined) {
  if (!clanInfo) {
    return "";
  }
  
  let lightDark = getSiteTheme().match("dark") ? "dark" : "light";
  return `camp_bg/${clanInfo?.biome.toLowerCase()}/${clanInfo?.season.toLowerCase().replace("-", "")}_${clanInfo?.campBg}_${lightDark}.png`
}

function getCampBGPathNoClan(biome: string, season: string, campNum: string) {
  let lightDark = getSiteTheme().match("dark") ? "dark" : "light";
  return `camp_bg/${biome.toLowerCase()}/${season.toLowerCase().replace("-", "")}_${campNum}_${lightDark}.png`
}

export { download, formatText, setCustomCss, getCampBGPath, getCampBGPathNoClan };
