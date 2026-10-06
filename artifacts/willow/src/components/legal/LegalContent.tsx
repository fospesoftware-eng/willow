import { LegalLayout } from "./LegalLayout";

type LegalData = {
  title: string;
  updated: string;
  sections: { heading: string; paragraphs?: string[]; bullets?: string[] }[];
};

export function LegalContent({ data }: { data: LegalData }) {
  return (
    <LegalLayout title={data.title} updated={data.updated}>
      {data.sections.map((s, i) => (
        <div key={i} className="space-y-3">
          {s.heading && (
            <h2 className="font-serif text-2xl text-forest-900">{s.heading}</h2>
          )}
          {s.paragraphs?.map((p, j) => (
            <p key={j} className={i === 0 && j === 0 ? "italic text-forest-600" : undefined}>
              {p}
            </p>
          ))}
          {s.bullets && (
            <ul className="list-disc pl-6 space-y-2">
              {s.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </LegalLayout>
  );
}
