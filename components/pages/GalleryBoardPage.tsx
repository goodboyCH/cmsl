'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { GalleryListPage } from './GalleryListPage';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface GalleryPostSummary {
  id: number;
  created_at: string;
  title: string; title_ko?: string;
  thumbnail_url: string;
}

interface GalleryBoardPageProps {
  session: Session | null;
}

export function GalleryBoardPage({ session }: GalleryBoardPageProps) {
  const [posts, setPosts] = useState<GalleryPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const from = (currentPage - 1) * postsPerPage;
      const to = from + postsPerPage - 1;
      
      // 2. 쿼리에 title_ko 추가
      let query = supabase.from('gallery').select('id, created_at, title, title_ko, thumbnail_url', { count: 'exact' });
      
      if (searchQuery) {
        // 3. 검색 시 영문/한글 제목 모두 검색 (or 조건)
        query = query.or(`title.ilike.%${searchQuery}%,title_ko.ilike.%${searchQuery}%`);
      }
      
      const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to);
      
      if (error) throw error;
      
      setPosts(data || []);
      setTotalPosts(count || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, postsPerPage, searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchQuery(searchTerm);
  };
  
  
  return (
    <GalleryListPage 
      posts={posts} 
      loading={loading} 
      error={error} 
      session={session}
      currentPage={currentPage} 
      totalPosts={totalPosts} 
      postsPerPage={postsPerPage}
      searchTerm={searchTerm} 
      setSearchTerm={setSearchTerm} 
      handleSearch={handleSearch}
      onPageChange={setCurrentPage} 
      onPostClick={(id: number) => router.push(`/board/gallery/${id}`)} 
    />
  );
}