import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { NewsPage } from './NewsPage';
import { NoticeDetailPage } from './NoticeDetailPage';
import { EditNoticePage } from './EditNoticePage';
import { supabase } from '@/lib/supabaseClient';

interface Attachment {
  name: string;
  url: string;
}

interface NoticeSummary {
  id: number;
  created_at: string;
  title: string;
  author: string;
  is_pinned: boolean;
}

interface NoticeDetail extends NoticeSummary {
  content: string;
  attachments: Attachment[] | null;
}

interface NoticeBoardPageProps {
  session: Session | null;
}

type BoardView = { mode: 'list' } | { mode: 'detail'; id: number } | { mode: 'edit'; id: number };

export function NoticeBoardPage({ session }: NoticeBoardPageProps) {
  const [view, setView] = useState<BoardView>({ mode: 'list' });
  const [notices, setNotices] = useState<NoticeSummary[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPinned, setTotalPinned] = useState(0); // 전체 고정 글 개수 state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotices = async () => {
    setLoading(true);
    setError(null);
    try {
      const from = (currentPage - 1) * postsPerPage;
      const to = from + postsPerPage - 1;

      // 검색어 쿼리 준비
      let query = supabase.from('notices').select('id, created_at, title, author, is_pinned', { count: 'exact' });
      let pinnedQuery = supabase.from('notices').select('*', { count: 'exact', head: true }).eq('is_pinned', true);

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
        pinnedQuery = pinnedQuery.ilike('title', `%${searchQuery}%`);
      }
      
      // 데이터 가져오기와 고정 글 개수 가져오기를 동시에 실행
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
  };
  
  const fetchSingleNotice = async (id: number) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('notices').select('*').eq('id', id).single();
    if (error) setError(error.message);
    else setSelectedNotice(data || null);
    setLoading(false);
  };

  useEffect(() => {
    if (view.mode === 'list') {
      fetchNotices();
    }
    if (view.mode === 'detail' || view.mode === 'edit') {
      fetchSingleNotice(view.id);
    }
  }, [view, currentPage, searchQuery]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchQuery(searchTerm);
  };
  
  const handleTogglePin = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase.from('notices').update({ is_pinned: !currentStatus }).eq('id', id);
    if (error) {
      alert(`상태 변경 중 오류: ${error.message}`);
    } else {
      fetchNotices();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      const { error } = await supabase.from('notices').delete().eq('id', id);
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
      return <NewsPage 
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
        onPostClick={(id) => setView({ mode: 'detail', id })} 
        onEdit={(id) => setView({ mode: 'edit', id })}
        onDelete={handleDelete}
        onTogglePin={handleTogglePin}
      />;
    case 'detail':
      return <NoticeDetailPage 
        notice={selectedNotice}
        loading={loading}
        session={session}
        onBackToList={() => setView({ mode: 'list' })} 
        onEdit={(id) => setView({ mode: 'edit', id })}
        onDelete={handleDelete}
      />;
    case 'edit':
      return <EditNoticePage 
        noticeId={view.id} 
        onBack={() => setView({ mode: 'detail', id: view.id })} 
      />;
    default:
      return <div>Error: Invalid view mode.</div>;
  }
}