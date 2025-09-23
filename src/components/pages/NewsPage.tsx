import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollAnimation } from '../ScrollAnimation';
import { Session } from '@supabase/supabase-js';
import { Star, Pin } from 'lucide-react';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface NoticeSummary {
  id: number;
  created_at: string;
  title: string;
  author: string;
  is_pinned: boolean;
}

interface NewsPageProps {
  notices: NoticeSummary[];
  loading: boolean;
  error: string | null;
  session: Session | null;
  currentPage: number;
  totalPosts: number;
  totalPinned: number;
  postsPerPage: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  onPageChange: (page: number) => void;
  onPostClick: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onTogglePin: (id: number, currentStatus: boolean) => void;
}

export function NewsPage({ 
  notices, 
  loading, 
  error, 
  session, 
  currentPage, 
  totalPosts, 
  totalPinned,
  postsPerPage, 
  searchTerm, 
  setSearchTerm, 
  handleSearch, 
  onPageChange, 
  onPostClick, 
  onEdit, 
  onDelete, 
  onTogglePin 
}: NewsPageProps) {
  
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const totalRegularPosts = totalPosts - totalPinned;
  const pinnedOnThisPage = notices.filter(n => n.is_pinned).length;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 4);
    let endPage = Math.min(totalPages, currentPage + 5);

    if (totalPages > 10 && endPage - startPage < 9) {
      if (currentPage < 5) {
        endPage = 10;
      } else {
        startPage = Math.max(1, totalPages - 9);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); onPageChange(i); }} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-8 space-y-8">
      <ScrollAnimation>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-primary">Notices & News</h1>
          <p className="text-xl text-muted-foreground">Stay updated with the latest news and announcements.</p>
        </div>
      </ScrollAnimation>
      <ScrollAnimation delay={100}>
        <Card className="elegant-shadow">
          <CardHeader>
            <CardTitle>공지사항</CardTitle>
            <CardDescription>총 {totalPosts}개의 게시글이 있습니다.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {loading && <p className="text-center p-8">Loading notices...</p>}
            {error && <p className="text-center text-red-500 p-8">Error: {error}</p>}
            {!loading && !error && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left min-w-[600px]">
                    <thead className="border-b text-muted-foreground">
                      <tr>
                        <th className="p-3 w-[10%] text-center">번호</th>
                        <th className="p-3 w-[45%]">제목</th>
                        <th className="p-3 w-[15%] text-center">작성자</th>
                        <th className="p-3 w-[15%] text-center">등록일</th>
                        {session && <th className="p-3 w-[15%] text-center">관리</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {notices.length > 0 ? (
                        notices.map((notice, index) => (
                          <tr key={notice.id} className={`border-b ${notice.is_pinned ? 'bg-muted/50' : 'hover:bg-muted/50'}`}>
                            <td className="p-3 text-center font-medium">
                              {notice.is_pinned ? (
                                <Badge variant="secondary">공지</Badge>
                              ) : (
                                <span className="text-muted-foreground">
                                  {totalRegularPosts - ((currentPage - 1) * postsPerPage) - (index - pinnedOnThisPage)}
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              <button onClick={() => onPostClick(notice.id)} className="text-left hover:text-primary">{notice.title}</button>
                            </td>
                            <td className="p-3 text-center">{notice.author}</td>
                            <td className="p-3 text-center">{new Date(notice.created_at).toLocaleDateString()}</td>
                            {session && (
                              <td className="p-3 text-center space-x-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onTogglePin(notice.id, notice.is_pinned)}>
                                  <Star className={`h-4 w-4 ${notice.is_pinned ? 'text-yellow-500 fill-yellow-400' : 'text-muted-foreground'}`} />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => onEdit(notice.id)}>수정</Button>
                                <Button variant="destructive" size="sm" onClick={() => onDelete(notice.id)}>삭제</Button>
                              </td>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={session ? 5 : 4} className="p-8 text-center text-muted-foreground">게시글이 없습니다.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) onPageChange(currentPage - 1); }} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} />
                      </PaginationItem>
                      {renderPageNumbers()}
                      <PaginationItem>
                        <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) onPageChange(currentPage + 1); }} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              
                <div className="flex justify-center items-center gap-2 max-w-md mx-auto pt-8">
                  <Input 
                    type="text" 
                    placeholder="제목으로 검색..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch}>검색</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </ScrollAnimation>
    </div>
  );
}