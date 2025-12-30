import { EditGalleryPage } from '@/components/pages/EditGalleryPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGallery({ params }: PageProps) {
  const { id } = await params;
  return <EditGalleryPage id={id} />;
}
