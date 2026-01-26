import { NoticeBoardPage } from '@/components/pages/NoticeBoardPage';
import { createClient } from '@/utils/supabase/server';

export default async function NoticeBoard() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return <NoticeBoardPage session={session} />;
}
