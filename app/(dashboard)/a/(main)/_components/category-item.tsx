'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';

import { Badge } from '@/components/ui/badge';

export const CategoryItem = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get('categoryId');
  const currentTitle = searchParams.get('title');

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <Badge
      onClick={onClick}
      className="cursor-pointer"
      variant={isSelected ? 'default' : 'secondary'}
    >
      <div className="truncate">{label}</div>
    </Badge>
  );
};
