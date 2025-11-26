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
  graduation_year: string; // year_range -> graduation_year 변경
}

export default function AlumniPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: alumni, isLoading, error, refetch } = useQuery({
    queryKey: ['alumni'],
    queryFn: async () => {
      // DB 컬럼 graduation_year 기준으로 정렬
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .order('graduation_year', { ascending: false });
      
      if (error) throw error;
      return data as Alumni[];
    },
  });

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
        description: "Failed to delete alumni.",
      });
    } else {
      toast({
        title: "Success",
        description: "Alumni deleted successfully.",
      });
      refetch();
    }
    setDeleteId(null);
  };

  // 클라이언트 사이드 정렬 (연도 -> 이름)
  const sortedAlumni = [...(alumni || [])].sort((a, b) => {
    const yearA = parseInt(a.graduation_year || '0');
    const yearB = parseInt(b.graduation_year || '0');
    
    if (yearB === yearA) {
        return (a.name || '').localeCompare(b.name || '');
    }
    return yearB - yearA;
  });

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error loading alumni</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Alumni</h1>
          <p className="text-muted-foreground">Our distinguished graduates</p>
        </div>
        <Button onClick={() => navigate('/admin/alumni/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add Alumni
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedAlumni.map((person) => (
          <Card key={person.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">{person.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{person.degree}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {person.graduation_year}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => navigate(`/admin/alumni/${person.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(person.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the alumni record.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              {person.current_position && (
                <div className="flex items-start gap-2 text-sm">
                  <Building2 className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <span>{person.current_position}</span>
                </div>
              )}
              {person.thesis && (
                <div className="flex items-start gap-2 text-sm">
                  <BookOpen className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <span className="italic text-muted-foreground line-clamp-2" title={person.thesis}>
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