import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';

// 폼 스키마 정의 (graduation_year 필수)
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  degree: z.string().min(1, 'Degree is required'),
  thesis: z.string().optional(),
  current_position: z.string().optional(),
  achievements: z.string().optional(),
  graduation_year: z.string().min(1, 'Graduation Year is required'),
});

export default function EditAlumniPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      degree: '',
      thesis: '',
      current_position: '',
      achievements: '',
      graduation_year: '',
    },
  });

  // 데이터 수정 시 기존 정보 불러오기
  useEffect(() => {
    if (id) {
      const fetchAlumni = async () => {
        const { data, error } = await supabase
          .from('alumni')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch alumni details.",
          });
          navigate('/admin/alumni');
          return;
        }

        if (data) {
          form.reset({
            name: data.name,
            degree: data.degree,
            thesis: data.thesis || '',
            current_position: data.current_position || '',
            achievements: data.achievements ? data.achievements.join('\n') : '',
            graduation_year: data.graduation_year || '', // DB 컬럼 연결
          });
        }
      };

      fetchAlumni();
    }
  }, [id, form, navigate, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // 저장할 데이터 객체 생성
      const alumniData = {
        name: values.name,
        degree: values.degree,
        thesis: values.thesis || null,
        current_position: values.current_position || null,
        achievements: values.achievements ? values.achievements.split('\n').filter(Boolean) : [],
        graduation_year: values.graduation_year,
      };

      const { error } = id
        ? await supabase.from('alumni').update(alumniData).eq('id', id)
        : await supabase.from('alumni').insert([alumniData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Alumni ${id ? 'updated' : 'created'} successfully`,
      });
      navigate('/admin/alumni');
    } catch (error) {
      console.error('Error saving alumni:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save alumni.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/admin/alumni')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Alumni
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {id ? 'Edit Alumni' : 'Add New Alumni'}
        </h1>
        <p className="text-muted-foreground">
          {id ? 'Update alumni information' : 'Create a new alumni record'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Kim Kyung-soo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Ph.D." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="graduation_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Graduation Year</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="current_position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Position</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Senior Researcher at Hyundai Steel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thesis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thesis Title</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter thesis title..." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="achievements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Achievements (One per line)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter achievements..." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {id ? 'Save Changes' : 'Create Alumni'}
          </Button>
        </form>
      </Form>
    </div>
  );
}