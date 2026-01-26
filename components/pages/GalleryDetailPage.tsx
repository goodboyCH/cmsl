'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

interface GalleryPostDetail {
  id: number;
  created_at: string;
  title: string; title_ko?: string;
  content: string; content_ko?: string;
  author: string;
  thumbnail_url: string;
}

interface GalleryDetailPageProps {
  session: Session | null;
  id: string;
}

export function GalleryDetailPage({ session, id }: GalleryDetailPageProps) {
  const router = useRouter();
  const { language } = useLanguage();

  const [currentUser, setCurrentUser] = useState<Session | null>(session);
  const [post, setPost] = useState<GalleryPostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        setCurrentUser(currentSession);
      });
    } else {
      setCurrentUser(session);
    }
  }, [session]);

  // 3. 헬퍼 함수
  const getContent = (data: GalleryPostDetail | null, field: 'title' | 'content') => {
    if (!data) return '';
    let text = '';
    if (language === 'ko' && data[`${field}_ko`]) {
      text = data[`${field}_ko`]!;
    } else {
      text = data[field];
    }
    // Replace &nbsp; and &amp;nbsp; with space
    return text.replace(/(&nbsp;|&#160;|&#xA0;|\u00A0|&amp;nbsp;)/gi, ' ');
  };

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
      router.push('/board/gallery');
    }
  };

  if (loading) return <p className="text-center p-8">Loading post...</p>;
  if (!post) return <p className="text-center p-8">Post not found.</p>;

  return (
    <div className="container px-4 sm:px-8 py-8 md:py-12">
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              {/* 4. 적용 */}
              <CardTitle>{getContent(post, 'title')}</CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-muted-foreground pt-2">
                <span>작성자: {post.author}</span>
                <span>등록일: {new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            {currentUser && (
              <div className="flex-shrink-0 w-full sm:w-auto flex items-center gap-2">
                <Button variant="outline" onClick={() => router.push(`/board/gallery/${post.id}/edit`)} className="flex-1 sm:flex-none">수정</Button>
                <Button variant="destructive" onClick={() => handleDelete(post.id)} className="flex-1 sm:flex-none">삭제</Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="py-8">
          <div className="prose dark:prose-invert w-full max-w-full">
            {/* 4. 적용 */}
            <div dangerouslySetInnerHTML={{ __html: getContent(post, 'content') || '' }} />
          </div>
        </CardContent>
      </Card>
      <div className="text-center mt-8">
        <Button onClick={() => router.push('/board/gallery')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로 돌아가기
        </Button>
      </div>
    </div>
  );
}