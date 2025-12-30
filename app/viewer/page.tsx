'use client';

import dynamic from 'next/dynamic';

// VTK.js는 SSR에서 작동하지 않으므로 동적 import 사용
const VtiViewerPage = dynamic(
  () => import('@/components/pages/VtiViewerPage').then(mod => mod.VtiViewerPage),
  {
    ssr: false,
    loading: () => (
      <div className="h-[80vh] w-full flex items-center justify-center">
        Loading 3D Viewer...
      </div>
    )
  }
);

export default function Viewer() {
  return <VtiViewerPage />;
}
