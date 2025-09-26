import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollAnimation } from '../ScrollAnimation';
import { Session } from '@supabase/supabase-js';
import { Star, Edit, Trash2 } from 'lucide-react';
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
  notices, loading, error, session, currentPage, totalPosts, totalPinned, 
  postsPerPage, searchTerm, setSearchTerm, handleSearch, onPageChange, 
  onPostClick, onEdit, onDelete, onTogglePin 
}: NewsPageProps) {
  
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const totalRegularPosts = totalPosts - totalPinned;
  const pinnedOnThisPage = notices.filter(n => n.is_pinned).length;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink href="#" isActive={i === currentPage} onClick={(e) => { e.preventDefault(); onPageChange(i); }}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="container px-4 sm:px-8 py-8 md:py-12 space-y-8">
      <ScrollAnimation>
        <div className="text-center sm:text-left space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">Notices & News</h1>
          <p className="text-lg sm:text-xl text-muted-foreground">Stay updated with the latest news and announcements.</p>
        </div>
      </ScrollAnimation>
      <ScrollAnimation delay={100}>
        <Card className="elegant-shadow">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">공지사항</CardTitle>
            <CardDescription>총 {totalPosts}개의 게시글이 있습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-center p-8">Loading notices...</p>}
            {error && <p className="text-center text-red-500 p-8">Error: {error}</p>}
            {!loading && !error && (
              <>
                {/* --- ⬇️ 모바일 뷰를 라인 기반 리스트로 변경 ⬇️ --- */}
                <div className="border-t">
                  {notices.length > 0 ? (
                    notices.map((notice, index) => (
                      <div 
                        key={notice.id} 
                        className={`border-b cursor-pointer ${notice.is_pinned ? 'bg-muted/50' : 'hover:bg-muted/50'}`}
                        onClick={() => onPostClick(notice.id)}
                      >
                        {/* Desktop View: Table-like layout */}
                        <div className="hidden md:flex items-center text-sm">
                          <div className="p-3 w-[10%] text-center font-medium">
                            {notice.is_pinned ? <Badge variant="secondary">공지</Badge> : <span className="text-muted-foreground">{totalRegularPosts - ((currentPage - 1) * postsPerPage) - (index - pinnedOnThisPage)}</span>}
                          </div>
                          <div className="p-3 w-[45%] hover:text-primary">{notice.title}</div>
                          <div className="p-3 w-[15%] text-center">{notice.author}</div>
                          <div className="p-3 w-[15%] text-center">{new Date(notice.created_at).toLocaleDateString()}</div>
                          {session && (
                            <div className="p-3 w-[15%] text-center space-x-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onTogglePin(notice.id, notice.is_pinned); }}><Star className={`h-4 w-4 ${notice.is_pinned ? 'text-yellow-500 fill-yellow-400' : 'text-muted-foreground'}`} /></Button>
                              <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(notice.id); }}>수정</Button>
                              <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(notice.id); }}>삭제</Button>
                            </div>
                          )}
                        </div>
                        
                        {/* Mobile View: Vertical list layout */}
                        <div className="md:hidden p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              {notice.is_pinned && <Badge variant="secondary">공지</Badge>}
                            </div>
                            {session && (
                              <div className="flex items-center gap-1 -mr-2 -mt-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onTogglePin(notice.id, notice.is_pinned); }}><Star className={`h-4 w-4 ${notice.is_pinned ? 'text-yellow-500 fill-yellow-400' : 'text-muted-foreground'}`} /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onEdit(notice.id); }}><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onDelete(notice.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-base mb-2 hover:text-primary">{notice.title}</h3>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>{notice.author}</span>
                            <span>{new Date(notice.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-8 text-center text-muted-foreground">게시글이 없습니다.</p>
                  )}
                </div>
                {/* --- ⬆️ 수정 완료 ⬆️ --- */}

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); currentPage > 1 && onPageChange(currentPage - 1); }} />
                        </PaginationItem>
                        {renderPageNumbers()}
                        <PaginationItem>
                          <PaginationNext href="#" onClick={(e) => { e.preventDefault(); currentPage < totalPages && onPageChange(currentPage + 1); }} />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              
                <div className="flex items-center gap-2 max-w-sm mx-auto pt-8">
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