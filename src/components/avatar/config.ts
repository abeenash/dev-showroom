// How "little me" keeps you company (both need motion allowed; with reduced motion it stays
// static in the header):
// - "walk" from 1536px: the free margin beside the content (half of the space outside the 88rem
//   shell, plus its 40px padding) fits the 64px avatar, so it walks down that margin.
// - "corner" below that (laptops, split screen, phones): the margin is only 40–100px, so it rides
//   along in the bottom-left corner instead.
export type AvatarMode = "walk" | "corner";

export const WALK_MQ = "(prefers-reduced-motion: no-preference) and (min-width: 1536px)";
export const CORNER_MQ = "(prefers-reduced-motion: no-preference) and (max-width: 1535.98px)";
