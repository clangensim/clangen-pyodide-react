import "../styles/preloader.css";

function LoadIndicator({loadText}: {loadText: string}) {
  return (
    <div id="preloader-container">
        <div id="preloader" />
        <p>{loadText}</p>
    </div>
  );
}

export default LoadIndicator;
