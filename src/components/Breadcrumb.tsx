import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol
        className="inline-flex items-center space-x-1 text-sm text-gray-500"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => (
          <li
            key={index}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="inline-flex items-center"
          >
            {index > 0 && (
              <span className="mx-2" aria-hidden="true">{'>'}</span>
            )}
            {index === items.length - 1 ? (
              <>
                <span
                  itemProp="name"
                  className="text-gray-900"
                  aria-current="page"
                >
                  {item.name}
                </span>
                <meta itemProp="position" content={String(index + 1)} />
              </>
            ) : (
              <>
                <Link
                  href={item.url}
                  itemProp="item"
                  className="hover:text-blue-600 transition-colors"
                >
                  <span itemProp="name">{item.name}</span>
                </Link>
                <meta itemProp="position" content={String(index + 1)} />
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
