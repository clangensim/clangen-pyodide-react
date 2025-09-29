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

export { download, formatText };
