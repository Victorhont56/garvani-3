import { Suspense } from 'react';
import { ListingsContainer } from '../components/ListingsContainer';
import { SkeltonCard } from '../components/SkeletonCard';

interface SearchParams {
  filter?: string;
  state?: string;
  lga?: string;
  mode?: string;
  type?: string;
  guest?: string;
  room?: string;
  bathrooms?: string;
}

export default function Home({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  return (
    <div className="container mx-auto px-5 lg:px-10">
      <Suspense key={JSON.stringify(searchParams)} fallback={
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {Array.from({ length: 9 }).map((_, index) => (
            <SkeltonCard key={index} />
          ))}
        </div>
      }>
        <ListingsContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}