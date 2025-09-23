import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Session } from '@supabase/supabase-js';
import 'react-quill/dist/quill.snow.css';
import { Paperclip } from 'lucide-react';

interface Attachment {
  name: string;
  url: string;
}

interface NoticeDetail {
  id: number;
  created_at: string;
  title: string;
  content: string;
  author: string;
  attachments: Attachment[] | null;
}

interface NoticeDetailPageProps {
  notice: NoticeDetail | null;
  loading: boolean;
  session: Session | null;
  onBackToList: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function NoticeDetailPage({ notice, loading, session, onBackToList, onEdit, onDelete }: NoticeDetailPageProps) {
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
                <Button variant="outline" onClick={() => onEdit(notice.id)}>수정</Button>
                <Button variant="destructive" onClick={() => onDelete(notice.id)}>삭제</Button>
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
                  <a 
                    key={index} 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center p-2 rounded-md hover:bg-muted/50"
                  >
                    <span className="text-sm text-primary underline">{file.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="text-center mt-8">
        <Button onClick={onBackToList} variant="outline">목록으로 돌아가기</Button>
      </div>
    </div>
  );
}