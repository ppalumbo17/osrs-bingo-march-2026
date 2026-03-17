type LinkItem = {
  label: string;
  url?: string;
};

type LinkSectionProps = {
  title: string;
  icon: string;
  items: LinkItem[];
};

export function LinkSection({ title, icon, items }: LinkSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="link-section">
      <h3 className="link-section-title">
        <span aria-hidden="true">{icon}</span> {title}
      </h3>
      <ul className="link-section-list">
        {items.map((item, i) => (
          <li key={i}>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-section-anchor"
              >
                {item.label}
              </a>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
