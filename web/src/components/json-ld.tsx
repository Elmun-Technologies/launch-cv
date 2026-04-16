/** Server-safe JSON-LD for Google rich results / knowledge graph. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD requires inline script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
