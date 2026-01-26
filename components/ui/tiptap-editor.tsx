'use client';

import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3 } from 'lucide-react';

interface MenuBarProps {
  editor: any;
  onImageUpload?: () => void;
}

const MenuBar = ({ editor, onImageUpload }: MenuBarProps) => {
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
      {onImageUpload && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onImageUpload}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  onImageUpload?: (editor: any) => void;
}

export function TiptapEditor({ value, onChange, onImageUpload }: TiptapEditorProps) {
  const extensions = React.useMemo(() => [
    StarterKit,
    Underline,
    Link.configure({ openOnClick: false }),
    Image.configure({ inline: true }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
  ], []);

  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none min-h-[200px] p-4 focus:outline-none',
      },
    },
  });

  // Sync value prop with editor content
  React.useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();

    // 1. 내용이 완전히 같다면 무시
    if (currentContent === value) return;

    // 2. [안전 장치] 만약 에디터에는 이미지가 있는데(<img), 부모 값(value)에는 없다면?
    // 이는 "방금 이미지를 넣었는데 부모가 옛날 텍스트로 덮어쓰려는 상황"이므로 무시합니다.
    if (currentContent.includes('<img') && !value.includes('<img')) {
      return;
    }

    // 3. 그 외의 경우 (단순 텍스트 변경 등)이고, 사용자가 작업 중(focus)이 아닐 때만 동기화
    if (!editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const handleImageUpload = useCallback(() => {
    if (editor && onImageUpload) {
      onImageUpload(editor);
    }
  }, [editor, onImageUpload]);

  return (
    <div className="border rounded-md overflow-hidden bg-background">
      <MenuBar editor={editor} onImageUpload={onImageUpload ? handleImageUpload : undefined} />
      <EditorContent editor={editor} />
    </div>
  );
}
