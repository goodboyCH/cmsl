import { NoticeDetailPage } from '@/components/pages/NoticeDetailPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NoticeDetail({ params }: PageProps) {
  const { id } = await params;
  return <NoticeDetailPage id={id} session={null} />;
}
