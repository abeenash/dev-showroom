// The browser's UI colour (<meta name="theme-color">, the address bar on phones) for each theme.
// Same values as --background in globals.css. A plain module, so both the server-rendered
// ThemeScript and the client ThemeToggle can import the values.
export const THEME_COLOR = { light: "#f4f1ea", dark: "#121210" } as const;
