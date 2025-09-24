import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { NewsPage } from './NewsPage';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom'; // 1. useNavigate 훅을 가져옵니다.

interface NoticeSummary {
  id: number;
  created_at: string;
  title: string;
  author: string;
  is_pinned: boolean;
}

interface NoticeBoardPageProps {
  session: Session | null;
}

export function NoticeBoardPage({ session }: NoticeBoardPageProps) {
  // 2. view와 selectedNotice 상태를 삭제합니다.
  const [notices, setNotices] = useState<NoticeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPinned, setTotalPinned] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate(); // 3. navigate 함수를 초기화합니다.

  // 4. useEffect에서 view 상태에 대한 의존성을 제거합니다.
  useEffect(() => {
    fetchNotices();
  }, [currentPage, searchQuery]);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const from = (currentPage - 1) * postsPerPage;
      const to = from + postsPerPage - 1;

      let query = supabase.from('notices').select('id, created_at, title, author, is_pinned', { count: 'exact' });
      let pinnedQuery = supabase.from('notices').select('*', { count: 'exact', head: true }).eq('is_pinned', true);

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
        pinnedQuery = pinnedQuery.ilike('title', `%${searchQuery}%`);
      }
      
      const [noticeResult, pinnedResult] = await Promise.all([
        query.order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).range(from, to),
        pinnedQuery
      ]);

      if (noticeResult.error) throw noticeResult.error;
      if (pinnedResult.error) throw pinnedResult.error;
      
      setNotices(noticeResult.data || []);
      setTotalPosts(noticeResult.count || 0);
      setTotalPinned(pinnedResult.count || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, postsPerPage, searchQuery]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchQuery(searchTerm);
  };
  
  const handleTogglePin = async (id: number, currentStatus: boolean) => {
    await supabase.from('notices').update({ is_pinned: !currentStatus }).eq('id', id);
    fetchNotices();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      await supabase.from('notices').delete().eq('id', id);
      fetchNotices(); // 목록을 다시 불러옵니다.
    }
  };

  // 5. 복잡한 switch 문 대신, NewsPage 컴포넌트만 반환합니다.
  return (
    <NewsPage 
      notices={notices}
      loading={loading}
      error={error}
      session={session}
      currentPage={currentPage}
      totalPosts={totalPosts}
      totalPinned={totalPinned}
      postsPerPage={postsPerPage}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      handleSearch={handleSearch}
      onPageChange={(page) => setCurrentPage(page)}
      // 6. 클릭/수정 이벤트를 navigate 함수를 이용한 URL 이동으로 변경합니다.
      onPostClick={(id) => navigate(`/board/news/${id}`)} 
      onEdit={(id) => navigate(`/board/news/${id}/edit`)}
      onDelete={handleDelete}
      onTogglePin={handleTogglePin}
    />
  );
}