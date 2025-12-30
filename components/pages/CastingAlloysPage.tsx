import React from 'react';
import { ResearchPageTemplate, ResearchPageContent } from '@/components/ResearchPageTemplate';

const defaultContent: Partial<ResearchPageContent> = {
  title: "Casting Alloys Research",
  subtitle: "Pioneering the future of high-strength, lightweight casting alloys for automotive and aerospace applications.",
  representative_media: { url: '', type: 'image' },
  research_sections: [],
  related_publications_title: "Key Publications",
  related_publication_ids: []
};

export function CastingAlloysPage() {
  return (
    <ResearchPageTemplate
      pageKey="research-casting"
      defaultContent={defaultContent}
    />
  );
}