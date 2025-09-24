import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { GalleryListPage } from './GalleryListPage';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface GalleryPostSummary {
  id: number;
  created_at: string;
  title: string;
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
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const from = (currentPage - 1) * postsPerPage;
      const to = from + postsPerPage - 1;
      let query = supabase.from('gallery').select('id, created_at, title, thumbnail_url', { count: 'exact' });
      
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }
      
      const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to);
      
      if (error) throw error;
      
      setPosts(data || []); // 데이터가 null일 경우 빈 배열로 설정
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
      onPostClick={(id: number) => navigate(`/board/gallery/${id}`)} 
    />
  );
}