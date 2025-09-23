import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import 'react-quill/dist/quill.snow.css';

export function GalleryDetailPage({ post, loading, session, onBackToList, onEdit, onDelete }: any) {
  if (loading) return <p className="text-center p-8">Loading post...</p>;
  if (!post) return <p className="text-center p-8">Post not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl">{post.title}</CardTitle>
              <div className="text-sm text-muted-foreground pt-2">
                <span>작성자: {post.author}</span> | <span>등록일: {new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            {session && (
              <div className="flex-shrink-0 space-x-2">
                <Button variant="outline" onClick={() => onEdit(post.id)}>수정</Button>
                <Button variant="destructive" onClick={() => onDelete(post.id)}>삭제</Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="py-8">
          <div className="prose dark:prose-invert max-w-none ql-snow">
            <div className="ql-editor" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </CardContent>
      </Card>
      <div className="text-center mt-8">
        <Button onClick={onBackToList} variant="outline">목록으로 돌아가기</Button>
      </div>
    </div>
  );
}