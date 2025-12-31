'use client';

import React, { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabaseClient';
import { X, Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';

const sanitizeForStorage = (filename: string) => {
  const cleaned = filename.replace(/[^a-zA-Z0-9._-]/g, '');
  if (cleaned.indexOf('.') === -1) {
    const extension = filename.split('.').pop();
    return `${cleaned}.${extension}`;
  }
  return cleaned;
};

// Tiptap Toolbar Component
const MenuBar = ({ editor, onImageUpload }: { editor: any; onImageUpload: () => void }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('URL을 입력하세요:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
      <Button
        type="button"
        variant={editor.isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('heading', { level: 3 }) ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <div className="w-px h-8 bg-border mx-1" />
      <Button
        type="button"
        variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <div className="w-px h-8 bg-border mx-1" />
      <Button
        type="button"
        variant={editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <div className="w-px h-8 bg-border mx-1" />
      <Button
        type="button"
        variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <div className="w-px h-8 bg-border mx-1" />
      <Button
        type="button"
        variant={editor.isActive('link') ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={addLink}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onImageUpload}
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Tiptap Editor Component
const TiptapEditor = ({
  value,
  onChange,
  onImageUpload
}: {
  value: string;
  onChange: (html: string) => void;
  onImageUpload: (editor: any) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[200px] p-4 focus:outline-none',
      },
    },
  });

  const handleImageUpload = () => {
    if (editor) {
      onImageUpload(editor);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden bg-background">
      <MenuBar editor={editor} onImageUpload={handleImageUpload} />
      <EditorContent editor={editor} />
    </div>
  );
};

export function AdminPage() {
  const router = useRouter();
  const [postType, setPostType] = useState<'notice' | 'gallery' | 'publication' | 'project'>('notice');

  const [title, setTitle] = useState('');
  const [titleKo, setTitleKo] = useState('');
  const [content, setContent] = useState('');
  const [contentKo, setContentKo] = useState('');

  const [author, setAuthor] = useState('Administrator');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [attachments, setAttachments] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [pubData, setPubData] = useState({ year: new Date().getFullYear(), authors: '', journal: '', doi_link: '', is_featured: false });
  const [pubImage, setPubImage] = useState<File | null>(null);

  const resetForm = () => {
    setTitle(''); setTitleKo('');
    setContent(''); setContentKo('');
    setAuthor('Administrator'); setThumbnail(null); setAttachments([]); setPubImage(null);
    setPubData({ year: new Date().getFullYear(), authors: '', journal: '', doi_link: '', is_featured: false });
    const thumbInput = document.getElementById('thumbnail-input') as HTMLInputElement; if (thumbInput) thumbInput.value = '';
    const attachInput = document.getElementById('attachment-input') as HTMLInputElement; if (attachInput) attachInput.value = '';
    const pubImageInput = document.getElementById('pub-image-input') as HTMLInputElement; if (pubImageInput) pubImageInput.value = '';
  };

  const handlePubDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setPubData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value, 10) || 0 : value }));
  };
  const handlePubImageChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) setPubImage(e.target.files[0]); };
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) setThumbnail(e.target.files[0]); };
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) setAttachments(Array.from(e.target.files)); };
  const removeAttachment = (index: number) => { setAttachments(attachments.filter((_, i) => i !== index)); };

  const handleImageUpload = useCallback(async (editor: any) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        setLoading(true);
        setMessage('이미지 업로드 중...');

        const filePath = `public/images/${Date.now()}_${sanitizeForStorage(file.name)}`;
        const { error: uploadError } = await supabase.storage.from('notice-attachments').upload(filePath, file);

        if (uploadError) {
          setMessage(`이미지 업로드 오류: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        const { data: urlData } = supabase.storage.from('notice-attachments').getPublicUrl(filePath);

        editor.chain().focus().setImage({ src: urlData.publicUrl }).run();

        setMessage('이미지 업로드 완료.');
        setLoading(false);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage('');
    try {
      if (postType === 'notice') {
        let uploadedAttachments = [];
        for (const file of attachments) {
          const filePath = `public/files/${Date.now()}_${sanitizeForStorage(file.name)}`;
          const { error } = await supabase.storage.from('notice-attachments').upload(filePath, file);
          if (error) throw error;
          const { data: urlData } = supabase.storage.from('notice-attachments').getPublicUrl(filePath);
          uploadedAttachments.push({ name: file.name, url: urlData.publicUrl });
        }
        await supabase.from('notices').insert([{
          title, title_ko: titleKo,
          content, content_ko: contentKo,
          author, attachments: uploadedAttachments
        }]);
      } else if (postType === 'gallery') {
        if (!thumbnail) throw new Error('대표 이미지는 필수입니다.');
        const thumbPath = `public/gallery/thumbnails/${Date.now()}_${sanitizeForStorage(thumbnail.name)}`;
        const { error } = await supabase.storage.from('notice-attachments').upload(thumbPath, thumbnail);
        if (error) throw error;
        const { data: thumbUrlData } = supabase.storage.from('notice-attachments').getPublicUrl(thumbPath);
        await supabase.from('gallery').insert([{
          title, title_ko: titleKo,
          content, content_ko: contentKo,
          author, thumbnail_url: thumbUrlData.publicUrl
        }]);
      } else if (postType === 'publication') {
        let imageUrl = null;
        if (pubImage) {
          const imagePath = `public/publication-images/${Date.now()}_${sanitizeForStorage(pubImage.name)}`;
          const { error } = await supabase.storage.from('publication-images').upload(imagePath, pubImage);
          if (error) throw error;
          const { data: imageUrlData } = supabase.storage.from('publication-images').getPublicUrl(imagePath);
          imageUrl = imageUrlData.publicUrl;
        }
        await supabase.from('publications').insert([{ title, abstract: content, image_url: imageUrl, ...pubData }]);
      }
      setMessage('게시물이 성공적으로 등록되었습니다!');
      resetForm();
    } catch (err: any) { setMessage(`오류 발생: ${err.message}`); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.reload(); };

  const renderPostForm = () => {
    if (postType === 'publication') {
      return (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="title">제목 (Title)</Label><Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="authors">저자 (Authors)</Label><Input id="authors" name="authors" value={pubData.authors} onChange={handlePubDataChange} required /></div>
            <div className="space-y-2"><Label htmlFor="journal">학술지 (Journal)</Label><Input id="journal" name="journal" value={pubData.journal} onChange={handlePubDataChange} /></div>
            <div className="space-y-2"><Label htmlFor="year">연도 (Year)</Label><Input id="year" name="year" type="number" value={pubData.year} onChange={handlePubDataChange} required /></div>
            <div className="space-y-2"><Label htmlFor="doi_link">DOI 링크</Label><Input id="doi_link" name="doi_link" value={pubData.doi_link} onChange={handlePubDataChange} /></div>
          </div>
          <div className="space-y-2"><Label>초록 (Abstract)</Label><Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} /></div>
          <div className="space-y-2"><Label htmlFor="pub-image-input">썸네일 이미지</Label><Input id="pub-image-input" type="file" accept="image/*" onChange={handlePubImageChange} /></div>
          <div className="flex items-center space-x-2 pt-2"><Checkbox id="is_featured" checked={pubData.is_featured} onCheckedChange={(checked) => setPubData(prev => ({ ...prev, is_featured: !!checked }))} /><Label htmlFor="is_featured">Featured Publication으로 지정</Label></div>
        </div>
      );
    }
    return (
      <>
        <div className="space-y-2"><Label htmlFor="author">작성자</Label><Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required /></div>

        <Tabs defaultValue="en" className="border p-4 rounded-md mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="en">English (Primary)</TabsTrigger>
            <TabsTrigger value="ko">Korean (Optional)</TabsTrigger>
          </TabsList>

          <TabsContent value="en" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title (EN)</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title in English" required />
            </div>
            <div className="space-y-2">
              <Label>Content (EN)</Label>
              <TiptapEditor
                value={content}
                onChange={setContent}
                onImageUpload={handleImageUpload}
              />
            </div>
          </TabsContent>

          <TabsContent value="ko" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title_ko">제목 (KO)</Label>
              <Input id="title_ko" value={titleKo} onChange={(e) => setTitleKo(e.target.value)} placeholder="한글 제목" />
            </div>
            <div className="space-y-2">
              <Label>내용 (KO)</Label>
              <TiptapEditor
                value={contentKo}
                onChange={setContentKo}
                onImageUpload={handleImageUpload}
              />
            </div>
          </TabsContent>
        </Tabs>

        {postType === 'gallery' && <div className="space-y-2 mt-4"><Label htmlFor="thumbnail-input">대표 이미지 (필수)</Label><Input id="thumbnail-input" type="file" accept="image/*" onChange={handleThumbnailChange} required /></div>}
        {postType === 'notice' && <div className="space-y-2 mt-4"><Label htmlFor="attachment-input">첨부파일</Label><Input id="attachment-input" type="file" multiple onChange={handleAttachmentChange} />
          {attachments.length > 0 && <div className="mt-2 space-y-2"><p className="text-sm font-medium">선택된 파일:</p><ul className="list-disc list-inside text-sm text-muted-foreground">{attachments.map((file, index) => (<li key={index} className="flex items-center justify-between"><span>{file.name}</span><Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAttachment(index)}><X className="h-4 w-4" /></Button></li>))}</ul></div>}
        </div>}
      </>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>게시물 관리</CardTitle>
              <CardDescription>공지사항, 갤러리, 논문, 프로젝트를 등록합니다.</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="link" onClick={() => router.push('/cmsl20042')}>콘텐츠 관리 페이지로 →</Button>
              <Button variant="outline" onClick={handleLogout}>로그아웃</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <ToggleGroup type="single" value={postType} onValueChange={(value) => { if (value) { setPostType(value as any); resetForm(); } }}>
              <ToggleGroupItem value="notice">공지사항</ToggleGroupItem>
              <ToggleGroupItem value="gallery">갤러리</ToggleGroupItem>
              <ToggleGroupItem value="publication">Publication</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderPostForm()}
            <Button type="submit" disabled={loading} className="mt-8">{loading ? '제출 중...' : '게시물 등록'}</Button>
            {message && <p className="text-sm text-muted-foreground pt-2">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
