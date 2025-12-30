import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface EditAlumniPageProps {
  alumniId?: number;
  onBack: () => void;
}

export function EditAlumniPage({ alumniId, onBack }: EditAlumniPageProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    degree: '',
    graduation_year: '',
    thesis: '',
    current_position: '',
    achievements: ''
  });

  // 데이터 불러오기 로직 (MembersPage 스타일과 일치)
  useEffect(() => {
    const fetchAlumni = async () => {
      if (!alumniId) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .eq('id', alumniId)
        .single();

      if (error) {
        console.error("Error fetching alumni detail:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load alumni data." });
      } else if (data) {
        setFormData({
          name: data.name || '',
          degree: data.degree || '',
          graduation_year: data.graduation_year || '',
          thesis: data.thesis || '',
          current_position: data.current_position || '',
          achievements: (data.achievements || []).join('\n')
        });
      }
      setLoading(false);
    };

    fetchAlumni();
  }, [alumniId, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      degree: formData.degree,
      graduation_year: formData.graduation_year,
      thesis: formData.thesis || null,
      current_position: formData.current_position || null,
      achievements: formData.achievements 
        ? formData.achievements.split('\n').filter(line => line.trim() !== '') 
        : []
    };

    try {
      let error;
      if (alumniId) {
        const { error: updateError } = await supabase
          .from('alumni')
          .update(payload)
          .eq('id', alumniId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('alumni')
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      toast({ title: "Success", description: "Alumni record saved successfully." });
      onBack();
    } catch (err: any) {
      console.error("Error saving alumni:", err);
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: err.message || "Failed to save record." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{alumniId ? 'Edit Alumni' : 'Add New Alumni'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduation_year">Graduation Year *</Label>
              <Input 
                id="graduation_year" 
                name="graduation_year" 
                value={formData.graduation_year} 
                onChange={handleChange} 
                placeholder="e.g., 2023"
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="degree">Degree *</Label>
            <Input 
              id="degree" 
              name="degree" 
              value={formData.degree} 
              onChange={handleChange} 
              placeholder="e.g., Ph.D., M.S."
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_position">Current Position</Label>
            <Input 
              id="current_position" 
              name="current_position" 
              value={formData.current_position} 
              onChange={handleChange} 
              placeholder="e.g., Senior Researcher at Samsung Electronics"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thesis">Thesis Title</Label>
            <Textarea 
              id="thesis" 
              name="thesis" 
              value={formData.thesis} 
              onChange={handleChange} 
              placeholder="Thesis title..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">Achievements / Note (One per line)</Label>
            <Textarea 
              id="achievements" 
              name="achievements" 
              value={formData.achievements} 
              onChange={handleChange} 
              placeholder="Award 1&#10;Achievement 2"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Alumni'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}