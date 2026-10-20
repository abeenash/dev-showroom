import { MarginLabel } from "./MarginLabel";

type Props = {
  n: string;
  label: string;
  id: string;
  before?: string;
  /** Exactly one accent word (or short phrase) per heading, in vermilion serif italic. */
  accent: string;
  after?: string;
  /** Use the big `display` size (Contact) instead of the section size. */
  display?: boolean;
};

// Section opener: mono margin label in columns 1–2, heading from column 3, hairline on top.
export function AccentHeading({ n, label, id, before, accent, after, display }: Props) {
  return (
    <div className="page-grid border-t pt-4">
      <MarginLabel n={n}>{label}</MarginLabel>
      <h2
        id={id}
        data-reveal
        className={`${display ? "display" : "h-section"} col-span-4 mt-6 md:col-span-10 md:mt-0`}
      >
        {before && `${before} `}
        <span className="accent-word">{accent}</span>
        {after && ` ${after}`}
      </h2>
    </div>
  );
}
