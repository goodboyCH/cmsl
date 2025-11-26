import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, GraduationCap, Building2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Alumni {
  id: number;
  name: string;
  degree: string;
  thesis: string | null;
  current_position: string | null;
  achievements: string[] | null;
  graduation_year: string; // Supabase 컬럼명 확인
}

export function EditAlumniPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // 데이터 불러오기
  const { data: alumni, isLoading, error, refetch } = useQuery({
    queryKey: ['alumni-admin'], // admin용 쿼리키
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .order('graduation_year', { ascending: false });
      
      if (error) throw error;
      return data as Alumni[];
    },
  });

  // 삭제 로직
  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from('alumni')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete alumni record.",
      });
    } else {
      toast({
        title: "Success",
        description: "Alumni record deleted successfully.",
      });
      refetch(); // 목록 새로고침
    }
    setDeleteId(null);
  };

  // 정렬 로직
  const sortedAlumni = [...(alumni || [])].sort((a, b) => {
    const yearA = parseInt(a.graduation_year || '0');
    const yearB = parseInt(b.graduation_year || '0');
    
    // 연도가 같으면 이름순 정렬
    if (yearB === yearA) {
        return (a.name || '').localeCompare(b.name || '');
    }
    return yearB - yearA;
  });

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error loading alumni data</div>;

  return (
    <div className="space-y-6 p-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alumni Management</h2>
          <p className="text-muted-foreground">
            Add, edit, or remove alumni records.
          </p>
        </div>
        <Button onClick={() => navigate('/admin/alumni/new')} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Alumni
        </Button>
      </div>

      {/* 카드 리스트 */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {sortedAlumni.map((person) => (
          <Card key={person.id} className="group relative hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1.5">
                <CardTitle className="text-lg font-bold">{person.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{person.degree}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {person.graduation_year}
                  </span>
                </div>
              </div>
              
              {/* 관리자용 수정/삭제 버튼 */}
              <div className="flex gap-1 opacity-80 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:text-blue-600"
                  onClick={() => navigate(`/admin/alumni/${person.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteId(person.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Alumni Record?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete <strong>{person.name}</strong>'s record. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 mt-2">
              {person.current_position && (
                <div className="flex items-start gap-2 text-sm">
                  <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span className="text-foreground/80">{person.current_position}</span>
                </div>
              )}
              {person.thesis && (
                <div className="flex items-start gap-2 text-sm">
                  <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span className="italic text-muted-foreground line-clamp-2 text-xs" title={person.thesis}>
                    "{person.thesis}"
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}