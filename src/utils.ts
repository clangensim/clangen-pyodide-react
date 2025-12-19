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

function setCustomCss() {
  // set site theme before custom css so it can be overwritten
  let siteTheme = localStorage.getItem("site-theme");
  if (!siteTheme || siteTheme == "auto") {
    let prefersLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
    siteTheme  = prefersLightMode ? "theme-light" : "theme-dark";
  }
  document.documentElement.className = siteTheme;

  const customCssElement = document.getElementById("custom-css");
  const customCss = localStorage.getItem("custom-css");
  // need the last condition or there will be flash of unstyled content
  if (customCssElement && customCss && customCssElement.textContent !== customCss) {
    customCssElement.textContent = customCss;
  }
}

export { download, formatText, setCustomCss };
