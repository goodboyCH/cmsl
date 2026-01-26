import { GalleryDetailPage } from '@/components/pages/GalleryDetailPage';
import { createClient } from '@/utils/supabase/server';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GalleryDetail({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return <GalleryDetailPage id={id} session={session} />;
}
