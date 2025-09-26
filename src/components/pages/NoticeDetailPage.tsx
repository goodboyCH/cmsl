import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Session } from '@supabase/supabase-js';
import 'react-quill/dist/quill.snow.css';
import { Paperclip, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

interface Attachment { name: string; url: string; }
interface NoticeDetail {
  id: number;
  created_at: string;
  title: string;
  content: string;
  author: string;
  attachments: Attachment[] | null;
}

interface NoticeDetailPageProps {
  session: Session | null;
}

export function NoticeDetailPage({ session }: NoticeDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      if (!id) return;
      setLoading(true);
      const { data } = await supabase.from('notices').select('*').eq('id', id).single();
      setNotice(data);
      setLoading(false);
    };
    fetchNotice();
  }, [id]);

  const handleDelete = async (noticeId: number) => {
    if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      await supabase.from('notices').delete().eq('id', noticeId);
      navigate('/board/news');
    }
  };

  if (loading) return <p className="text-center p-8">Loading notice...</p>;
  if (!notice) return <p className="text-center p-8">Notice not found.</p>;

  return (
    <div className="container px-4 sm:px-8 py-8 md:py-12">
      <Card>
        <CardHeader className="border-b">
          {/* --- ⬇️ 모바일 레이아웃 수정 ⬇️ --- */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              {/* CardTitle은 반응형으로 자동 조절됩니다. */}
              <CardTitle>{notice.title}</CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-muted-foreground pt-2">
                <span>작성자: {notice.author}</span>
                <span>등록일: {new Date(notice.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            {session && (
              <div className="flex-shrink-0 w-full sm:w-auto flex items-center gap-2">
                <Button variant="outline" onClick={() => navigate(`/board/news/${notice.id}/edit`)} className="flex-1 sm:flex-none">수정</Button>
                <Button variant="destructive" onClick={() => handleDelete(notice.id)} className="flex-1 sm:flex-none">삭제</Button>
              </div>
            )}
          </div>
          {/* --- ⬆️ 수정 완료 ⬆️ --- */}
        </CardHeader>
        <CardContent className="py-8 space-y-8">
          <div className="prose dark:prose-invert w-full max-w-full ql-snow">
            <div className="ql-editor" dangerouslySetInnerHTML={{ __html: notice.content }} />
          </div>

          {notice.attachments && notice.attachments.length > 0 && (
            <div className="border-t pt-6">
              <h4 className="font-semibold text-primary mb-4 flex items-center gap-2"><Paperclip className="h-5 w-5"/> 첨부파일</h4>
              <div className="space-y-2">
                {notice.attachments.map((file, index) => (
                  <a key={index} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 rounded-md hover:bg-muted/50 break-all">
                    <span className="text-sm text-primary underline">{file.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="text-center mt-8">
        <Button onClick={() => navigate('/board/news')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로 돌아가기
        </Button>
      </div>
    </div>
  );
}