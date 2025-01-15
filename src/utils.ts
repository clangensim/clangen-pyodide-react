const download = (b: Blob) => {
  const temp = document.createElement("a");
  temp.href = window.URL.createObjectURL(b);
  temp.download = "saves.zip";
  document.body.appendChild(temp);
  temp.click();
  document.body.removeChild(temp);
}

export { download };
