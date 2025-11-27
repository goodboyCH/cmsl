import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollAnimation } from '../ScrollAnimation';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useLanguage } from '@/components/LanguageProvider';
import { Session } from '@supabase/supabase-js'; // 1. Session import

interface Post {
  id: number;
  thumbnail_url: string;
  title: string;
  title_ko?: string;
  created_at: string;
}

interface GalleryListPageProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  session: Session | null; // 2. session prop 타입 정의 추가
  currentPage: number;
  totalPosts: number;
  postsPerPage: number;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearch: () => void;
  onPageChange: (page: number) => void;
  onPostClick: (id: number) => void;
}

export function GalleryListPage({ 
  posts, loading, error, session, // 3. session prop 받기
  currentPage, totalPosts, postsPerPage, 
  searchTerm, setSearchTerm, handleSearch, onPageChange, onPostClick 
}: GalleryListPageProps) {
  const { language } = useLanguage();

  const getTitle = (post: Post) => {
    if (language === 'ko' && post.title_ko) return post.title_ko;
    return post.title;
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;
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
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); onPageChange(i); }} isActive={currentPage === i}>
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
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">Gallery</h1>
          <p className="text-lg sm:text-xl text-muted-foreground">Explore our lab's activities and achievements.</p>
        </div>
      </ScrollAnimation>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-lg mx-auto">
        <Input 
          type="text" 
          placeholder="제목으로 검색..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} className="w-full sm:w-auto">검색</Button>
      </div>

      {loading && <p className="text-center p-8">Loading gallery...</p>}
      {error && <p className="text-center text-red-500 p-8">Error: {error}</p>}

      {!loading && !error && (
        <div className="space-y-8">
          {posts && posts.length > 0 ? (
            <ScrollAnimation delay={100}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {posts.map((post) => (
                  <Card key={post.id} className="elegant-shadow smooth-transition hover:shadow-lg cursor-pointer overflow-hidden group" onClick={() => onPostClick(post.id)}>
                    <div className="aspect-video overflow-hidden border-b">
                      <img src={post.thumbnail_url} alt={getTitle(post)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="truncate text-base sm:text-lg">{getTitle(post)}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">{new Date(post.created_at).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollAnimation>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">게시물이 없습니다.</p>
            </div>
          )}
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) onPageChange(currentPage - 1); }} /></PaginationItem>
                {renderPageNumbers()}
                <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) onPageChange(currentPage + 1); }} /></PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}