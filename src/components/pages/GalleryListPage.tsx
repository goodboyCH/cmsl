import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollAnimation } from '../ScrollAnimation';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export function GalleryListPage({ posts, loading, error, currentPage, totalPosts, postsPerPage, searchTerm, setSearchTerm, handleSearch, onPageChange, onPostClick }: any) {
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (totalPages > 5 && endPage - startPage < 4) {
      if (currentPage < 3) endPage = 5;
      else startPage = totalPages - 4;
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
    <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12 space-y-8">
      <ScrollAnimation>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Gallery</h1>
          <p className="text-xl text-muted-foreground">Explore our lab's activities and achievements.</p>
        </div>
      </ScrollAnimation>

      {/* 로딩 및 에러 메시지 처리 */}
      {loading && <p className="text-center p-8">Loading gallery...</p>}
      {error && <p className="text-center text-red-500 p-8">Error: {error}</p>}

      {/* 로딩이 끝나고 에러가 없을 때만 내용을 표시 */}
      {!loading && !error && (
        <div className="space-y-8">
          {/* 게시물이 있을 때만 그리드를 표시 */}
          {posts && posts.length > 0 ? (
            <ScrollAnimation delay={100} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <Card key={post.id} className="elegant-shadow smooth-transition hover:shadow-lg cursor-pointer overflow-hidden group" onClick={() => onPostClick(post.id)}>
                  <div className="aspect-video overflow-hidden">
                    <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <CardHeader>
                    <CardTitle className="truncate">{post.title}</CardTitle>
                    <CardDescription>{new Date(post.created_at).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </ScrollAnimation>
          ) : (
            // 게시물이 없을 때 메시지 표시
            <div className="text-center py-12">
              <p className="text-muted-foreground">게시물이 없습니다.</p>
            </div>
          )}
          
          {/* 페이지네이션 및 검색 바 */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) onPageChange(currentPage - 1); }} /></PaginationItem>
                {renderPageNumbers()}
                <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) onPageChange(currentPage + 1); }} /></PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          <div className="flex justify-center items-center gap-2 max-w-md mx-auto pt-4">
            <Input type="text" placeholder="제목으로 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
            <Button onClick={handleSearch}>검색</Button>
          </div>
        </div>
      )}
    </div>
  );
}