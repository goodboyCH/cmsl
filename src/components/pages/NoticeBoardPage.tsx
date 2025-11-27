import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { NewsPage } from './NewsPage';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

// 1. 인터페이스에 title_ko 추가 확인
interface NoticeSummary {
  id: number;
  created_at: string;
  title: string;
  title_ko?: string; // ✨ 필수
  author: string;
  is_pinned: boolean;
}

interface NoticeBoardPageProps {
  session: Session | null;
}

export function NoticeBoardPage({ session }: NoticeBoardPageProps) {
  const [notices, setNotices] = useState<NoticeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPinned, setTotalPinned] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotices();
  }, [currentPage, searchQuery]);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const from = (currentPage - 1) * postsPerPage;
      const to = from + postsPerPage - 1;

      // 2. ✨ 쿼리에 'title_ko'가 꼭 포함되어야 합니다! ✨
      let query = supabase
        .from('notices')
        .select('id, created_at, title, title_ko, author, is_pinned', { count: 'exact' });
      
      // 공지글 쿼리에도 title_ko 추가
      let pinnedQuery = supabase
        .from('notices')
        .select('id, created_at, title, title_ko, author, is_pinned', { count: 'exact', head: true })
        .eq('is_pinned', true);

      if (searchQuery) {
        // 한글/영문 제목 모두 검색되도록 설정
        query = query.or(`title.ilike.%${searchQuery}%,title_ko.ilike.%${searchQuery}%`);
        // pinnedQuery는 갯수만 세는 용도라면 필터링 제외해도 되지만, 정확성을 위해 포함
        pinnedQuery = pinnedQuery.or(`title.ilike.%${searchQuery}%,title_ko.ilike.%${searchQuery}%`);
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
      fetchNotices();
    }
  };

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
      onPostClick={(id) => navigate(`/board/news/${id}`)} 
      onEdit={(id) => navigate(`/board/news/${id}/edit`)}
      onDelete={handleDelete}
      onTogglePin={handleTogglePin}
    />
  );
}