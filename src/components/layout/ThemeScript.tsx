import { THEME_COLOR } from "@/lib/theme";

// Runs while the browser parses <head>, before first paint, so a saved theme never flashes.
// It only sets data-theme when the visitor picked one; otherwise CSS follows the system.
// It also points <meta name="theme-color"> (rendered just before it) at the theme in use.
// The `js` class lets CSS hide SplitText targets only when JavaScript is actually running.
const script = `(function(){var d=document.documentElement;d.classList.add('js');var t=null;try{t=localStorage.getItem('theme');if(t==='dark'||t==='light')d.setAttribute('data-theme',t);else t=null}catch(e){}var k=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',k==='dark'?'${THEME_COLOR.dark}':'${THEME_COLOR.light}')})()`;

export function ThemeScript() {
  return (
    <>
      {/* suppressHydrationWarning: the script above may change `content` before React hydrates. */}
      <meta name="theme-color" content={THEME_COLOR.light} suppressHydrationWarning />
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
