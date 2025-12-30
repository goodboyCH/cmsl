import React from 'react';
import { ResearchPageTemplate, ResearchPageContent } from '@/components/ResearchPageTemplate';

const defaultContent: Partial<ResearchPageContent> = {
  title: "Biodegradable Alloys Research",
  subtitle: "Developing next-generation bio-absorbable materials for temporary medical implants.",
  representative_media: { url: '', type: 'image' },
  research_sections: [],
  related_publications_title: "Key Publications",
  related_publication_ids: []
};

export function BiodegradableAlloysPage() {
  return (
    <ResearchPageTemplate
      pageKey="research-biodegradable"
      defaultContent={defaultContent}
    />
  );
}