import { GalleryBoardPage } from '@/components/pages/GalleryBoardPage';
import { createClient } from '@/utils/supabase/server';

export default async function GalleryBoard() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return <GalleryBoardPage session={session} />;
}
