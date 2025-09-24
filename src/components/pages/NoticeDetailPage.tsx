import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Session } from '@supabase/supabase-js';
import 'react-quill/dist/quill.snow.css';
import { Paperclip } from 'lucide-react';
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

// 1. props 인터페이스를 session만 받도록 수정합니다.
interface NoticeDetailPageProps {
  session: Session | null;
}

export function NoticeDetailPage({ session }: NoticeDetailPageProps) {
  const { id } = useParams(); // 2. URL로부터 게시물 ID를 가져옵니다.
  const navigate = useNavigate();
  
  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3. URL의 id를 사용해 특정 게시물 데이터를 불러옵니다.
    const fetchNotice = async () => {
      if (!id) return;
      setLoading(true);
      const { data } = await supabase.from('notices').select('*').eq('id', id).single();
      setNotice(data);
      setLoading(false);
    };
    fetchNotice();
  }, [id]); // id가 변경될 때마다 데이터를 다시 불러옵니다.

  const handleDelete = async (noticeId: number) => {
    if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      await supabase.from('notices').delete().eq('id', noticeId);
      navigate('/board/news'); // 삭제 후 목록으로 이동
    }
  };

  if (loading) return <p className="text-center p-8">Loading notice...</p>;
  if (!notice) return <p className="text-center p-8">Notice not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl">{notice.title}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground pt-2">
                <span>작성자: {notice.author}</span>
                <span>등록일: {new Date(notice.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            {session && (
              <div className="flex-shrink-0 space-x-2">
                {/* 4. 수정 버튼도 navigate를 사용하도록 변경 */}
                <Button variant="outline" onClick={() => navigate(`/board/news/${notice.id}/edit`)}>수정</Button>
                <Button variant="destructive" onClick={() => handleDelete(notice.id)}>삭제</Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="py-8 space-y-8">
          <div className="prose dark:prose-invert max-w-none ql-snow">
            <div className="ql-editor" dangerouslySetInnerHTML={{ __html: notice.content }} />
          </div>

          {notice.attachments && notice.attachments.length > 0 && (
            <div className="border-t pt-6">
              <h4 className="font-semibold text-primary mb-4 flex items-center gap-2"><Paperclip className="h-5 w-5"/> 첨부파일</h4>
              <div className="space-y-2">
                {notice.attachments.map((file, index) => (
                  <a key={index} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 rounded-md hover:bg-muted/50">
                    <span className="text-sm text-primary underline">{file.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="text-center mt-8">
        <Button onClick={() => navigate('/board/news')} variant="outline">목록으로 돌아가기</Button>
      </div>
    </div>
  );
}