import React from 'react';
import { ResearchPageTemplate, ResearchPageContent } from '@/components/ResearchPageTemplate';

const defaultContent: Partial<ResearchPageContent> = {
  title: "Thin Films Research",
  subtitle: "Advancing surface engineering through atomic layer deposition and thin film technologies.",
  representative_media: { url: '', type: 'image' },
  gallery_images: [],
  related_publications_title: "Key Publications",
  related_publication_ids: []
};

export function ThinFilmsPage() {
  return (
    <ResearchPageTemplate
      pageKey="research-films"
      defaultContent={defaultContent}
    />
  );
}