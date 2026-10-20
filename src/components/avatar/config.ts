// When "little me" walks: motion allowed, and a screen wide enough that the free margin beside the
// content (half of the space outside the 88rem shell, plus its 40px padding) fits the 64px avatar.
// Below 1536px that margin is only 40–100px, so it would sit on screenshots and text.
export const AVATAR_MQ = "(prefers-reduced-motion: no-preference) and (min-width: 1536px)";
