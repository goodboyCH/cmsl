import React, { useState, useEffect, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollAnimation } from '../ScrollAnimation';
import { Search, ExternalLink, Users, BookOpen, Edit, Trash2, ChevronDown } from 'lucide-react';
import { EditPublicationPage } from './EditPublicationPage';

interface Publication {
  id: number;
  title: string;
  authors: string;
  journal: string | null;
  year: number;
  doi_link: string | null;
  image_url: string | null;
  abstract: string | null;
  is_featured: boolean;
}

type ViewMode = { mode: 'list' } | { mode: 'edit', id: number };

export function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<ViewMode>({ mode: 'list' });
  
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const publicationRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [highlightedPubId, setHighlightedPubId] = useState<number | null>(null);
  const [abstractExpanded, setAbstractExpanded] = useState<number | null>(null);


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const fetchPublications = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('publications').select('*').order('year', { ascending: false }).order('is_featured', { ascending: false });
    if (error) setError(error.message);
    else setPublications(data);
    setLoading(false);
  };

  useEffect(() => {
    if (view.mode === 'list') fetchPublications();
  }, [view.mode]);
  
  const handleViewClick = (id: number) => {
    const node = publicationRefs.current.get(id);
    if (node) {
      // 헤더 높이를 고려하여 스크롤 위치 조정
      const headerOffset = 100; // 헤더 높이 + 추가 여백 (px)
      const elementPosition = node.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setHighlightedPubId(id);
      setTimeout(() => setHighlightedPubId(null), 2000);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 논문을 삭제하시겠습니까?')) {
      const { error } = await supabase.from('publications').delete().eq('id', id);
      if (error) alert(`삭제 오류: ${error.message}`);
      else {
        alert('삭제되었습니다.');
        fetchPublications();
      }
    }
  };

  const toggleAbstract = (id: number) => {
    setAbstractExpanded(prev => (prev === id ? null : id));
  };
  
  const years = ['all', ...Array.from(new Set(publications.map(p => p.year.toString()))).sort((a, b) => parseInt(b) - parseInt(a))];

  const filteredPublications = publications.filter(pub => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
                         pub.title.toLowerCase().includes(lowerSearchTerm) ||
                         pub.authors.toLowerCase().includes(lowerSearchTerm) ||
                         pub.journal?.toLowerCase().includes(lowerSearchTerm);
    const matchesYear = selectedYear === 'all' || pub.year.toString() === selectedYear;
    return matchesSearch && matchesYear;
  });

  if (view.mode === 'edit') {
    return <EditPublicationPage publicationId={view.id} onBack={() => setView({ mode: 'list' })} />;
  }
  
  return (
    <div className="container px-4 sm:px-8 py-8 md:py-12 space-y-12">
      <ScrollAnimation>
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">Publications</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our research contributions to computational materials science.
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation delay={200}>
        <Card className="elegant-shadow">
          <CardHeader><CardTitle className="flex items-center gap-2 text-xl sm:text-2xl"><Search className="h-5 w-5" /> Search & Filter</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative col-span-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search by title, author, journal..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
              </div>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>{years.map(year => <SelectItem key={year} value={year}>{year === 'all' ? 'All Years' : year}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </ScrollAnimation>
      
      {loading && <p className="text-center p-8">Loading publications...</p>}
      {error && <p className="text-center text-red-500 p-8">Error: {error}</p>}
      {!loading && !error && (
        <>
          {publications.filter(p => p.is_featured).length > 0 && (
            <ScrollAnimation delay={300}>
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary">Featured Publications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {publications.filter(p => p.is_featured).map((pub) => (
                    <Card key={pub.id} className="elegant-shadow smooth-transition hover:shadow-lg group relative flex flex-col">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 flex-grow">
                        {pub.image_url && (
                          <div className="relative h-48 sm:h-auto overflow-hidden rounded-t-lg sm:rounded-l-lg sm:rounded-r-none">
                            <img src={pub.image_url} alt={pub.title} className="w-full h-full object-cover group-hover:scale-105 smooth-transition" />
                            <div className="absolute top-2 left-2"><Badge className="bg-red-500 text-white">Featured</Badge></div>
                          </div>
                        )}
                        <div className={`p-4 sm:p-6 flex flex-col justify-between ${!pub.image_url && 'sm:col-span-2'}`}>
                          <div className="space-y-2">
                            <h3 className="font-bold text-base sm:text-lg leading-tight group-hover:text-primary smooth-transition">{pub.title}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{pub.authors}</p>
                            <p className="text-xs sm:text-sm font-medium">{pub.journal} ({pub.year})</p>
                          </div>
                          <div className="flex items-center justify-end mt-4 pt-4 border-t">
                            <Button size="sm" variant="outline" className="gap-2" onClick={() => handleViewClick(pub.id)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                      {session && <div className="absolute top-2 right-2 sm:top-4 sm:right-4 space-x-2"><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setView({ mode: 'edit', id: pub.id })}><Edit className="h-4 w-4" /></Button><Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(pub.id)}><Trash2 className="h-4 w-4" /></Button></div>}
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
          )}

          <ScrollAnimation delay={400}>
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">All Publications ({filteredPublications.length})</h2>
              <div className="space-y-4">
                {filteredPublications.map((pub) => (
                  <Card 
                    key={pub.id}
                    ref={(node) => {
                      if (node) publicationRefs.current.set(pub.id, node);
                      else publicationRefs.current.delete(pub.id);
                    }}
                    className={`elegant-shadow smooth-transition group relative ${highlightedPubId === pub.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  >
                    <CardContent>
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="flex-1 space-y-2">
                          <span className="text-xs sm:text-sm text-muted-foreground">{pub.year}</span>
                          <h3 className="font-bold text-base sm:text-lg leading-tight group-hover:text-primary smooth-transition">{pub.title}</h3>
                          <div className="space-y-1">
                            <p className="text-xs sm:text-sm text-muted-foreground"><Users className="inline h-3 w-3 mr-1" />{pub.authors}</p>
                            <p className="text-xs sm:text-sm font-medium"><BookOpen className="inline h-3 w-3 mr-1" />{pub.journal}</p>
                          </div>
                          {pub.abstract && (
                            <div className="pt-2 mt-2">
                              <p className={`text-sm text-muted-foreground leading-relaxed transition-all duration-300 ${abstractExpanded === pub.id ? 'max-h-screen' : 'max-h-12 overflow-hidden'}`}>
                                {pub.abstract}
                              </p>
                              <Button variant="link" size="sm" onClick={() => toggleAbstract(pub.id)} className="text-primary h-auto p-0 mt-1">
                                {abstractExpanded === pub.id ? 'Show Less' : 'Show More...'}
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                          {pub.doi_link && <Button asChild size="sm" variant="outline" className="gap-2 w-full"><a href={pub.doi_link} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3" />DOI</a></Button>}
                          {session && (
                            <>
                              <Button variant="outline" size="sm" className="gap-2 w-full" onClick={() => setView({ mode: 'edit', id: pub.id })}><Edit className="h-3 w-3" />Edit</Button>
                              <Button variant="destructive" size="sm" className="gap-2 w-full" onClick={() => handleDelete(pub.id)}><Trash2 className="h-3 w-3" />Delete</Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </>
      )}
    </div>
  );
}