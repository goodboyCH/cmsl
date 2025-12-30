import { GalleryDetailPage } from '@/components/pages/GalleryDetailPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GalleryDetail({ params }: PageProps) {
  const { id } = await params;
  return <GalleryDetailPage id={id} session={null} />;
}
