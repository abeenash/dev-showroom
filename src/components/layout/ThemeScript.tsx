// Runs while the browser parses <head>, before first paint, so a saved theme never flashes.
// It only sets data-theme when the visitor picked one; otherwise CSS follows the system.
// The `js` class lets CSS hide SplitText targets only when JavaScript is actually running.
const script = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')d.setAttribute('data-theme',t)}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
