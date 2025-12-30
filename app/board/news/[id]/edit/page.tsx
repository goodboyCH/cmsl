import { EditNoticePage } from '@/components/pages/EditNoticePage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNotice({ params }: PageProps) {
  const { id } = await params;
  return <EditNoticePage id={id} />;
}
