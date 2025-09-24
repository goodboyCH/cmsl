import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Session } from '@supabase/supabase-js';
import 'react-quill/dist/quill.snow.css';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

interface GalleryPostDetail {
  id: number;
  created_at: string;
  title: string;
  content: string;
  author: string;
  thumbnail_url: string;
}

interface GalleryDetailPageProps {
  session: Session | null;
}

export function GalleryDetailPage({ session }: GalleryDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<GalleryPostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setLoading(true);
      const { data } = await supabase.from('gallery').select('*').eq('id', id).single();
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleDelete = async (postId: number) => {
    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      await supabase.from('gallery').delete().eq('id', postId);
      navigate('/board/gallery');
    }
  };

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
                <Button variant="outline" onClick={() => navigate(`/board/gallery/${post.id}/edit`)}>수정</Button>
                <Button variant="destructive" onClick={() => handleDelete(post.id)}>삭제</Button>
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
        <Button onClick={() => navigate('/board/gallery')} variant="outline">목록으로 돌아가기</Button>
      </div>
    </div>
  );
}