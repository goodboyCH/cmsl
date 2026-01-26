import { NoticeDetailPage } from '@/components/pages/NoticeDetailPage';
import { createClient } from '@/utils/supabase/server';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NoticeDetail({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return <NoticeDetailPage id={id} session={session} />;
}
