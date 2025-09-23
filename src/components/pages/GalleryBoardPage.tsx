import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { GalleryListPage } from './GalleryListPage';
import { GalleryDetailPage } from './GalleryDetailPage';
import { EditGalleryPage } from './EditGalleryPage';
import { supabase } from '@/lib/supabaseClient';

interface GalleryPostSummary {
  id: number;
  created_at: string;
  title: string;
  thumbnail_url: string;
}

interface GalleryPostDetail extends GalleryPostSummary {
  content: string;
  author: string;
}

type GalleryBoardView = { mode: 'list' } | { mode: 'detail'; id: number } | { mode: 'edit'; id: number };

export function GalleryBoardPage({ session }: { session: Session | null }) {
  const [view, setView] = useState<GalleryBoardView>({ mode: 'list' });
  const [posts, setPosts] = useState<GalleryPostSummary[]>([]);
  const [selectedPost, setSelectedPost] = useState<GalleryPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
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
        setPosts(data || []);
        setTotalPosts(count || 0);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSinglePost = async (id: number) => {
      setLoading(true);
      const { data } = await supabase.from('gallery').select('*').eq('id', id).single();
      setSelectedPost(data);
      setLoading(false);
    };

    if (view.mode === 'list') {
      fetchPosts();
    } else if (view.mode === 'detail' || view.mode === 'edit') {
      fetchSinglePost(view.id);
    }
  }, [view, currentPage, searchQuery]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchQuery(searchTerm);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (error) {
            alert(`삭제 중 오류 발생: ${error.message}`);
        } else {
            alert('삭제되었습니다.');
            setView({ mode: 'list' });
        }
    }
  };

  switch (view.mode) {
    case 'list':
      return <GalleryListPage 
        posts={posts} loading={loading} error={error} session={session}
        currentPage={currentPage} totalPosts={totalPosts} postsPerPage={postsPerPage}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch}
        onPageChange={setCurrentPage} onPostClick={(id) => setView({ mode: 'detail', id })} 
      />;
    case 'detail':
      return <GalleryDetailPage 
        post={selectedPost} loading={loading} session={session}
        onBackToList={() => setView({ mode: 'list' })} 
        onEdit={(id) => setView({ mode: 'edit', id })}
        onDelete={handleDelete}
      />;
    case 'edit':
      return <EditGalleryPage 
        postId={view.id} 
        onBack={() => setView({ mode: 'detail', id: view.id })} 
      />;
    default:
      return <div>Error</div>;
  }
}