export function SectionHeader(props: {
  step: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="text-xs font-medium text-muted-foreground">{props.step}</div>
        <h2 className="text-lg font-semibold">{props.title}</h2>
        {props.subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{props.subtitle}</p>
        ) : null}
      </div>
      {props.right ? <div className="flex items-center gap-2">{props.right}</div> : null}
    </div>
  );
}
