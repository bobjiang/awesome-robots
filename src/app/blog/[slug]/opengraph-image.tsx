import { ImageResponse } from 'next/og';

// Route segment config  
export const runtime = 'edge';
export const alt = 'Awesome Robots Blog Post';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

// Simple OG image without heavy data imports
// This avoids bundling 1.4MB posts.json into edge function
export default async function Image({ params }: Props) {
  const { slug } = await params;
  
  // Extract title from slug (simple fallback)
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: 48 }}>🤖</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>
            Awesome Robots Blog
          </div>
        </div>

        {/* Title from slug */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: 'white',
            lineHeight: 1.2,
            marginTop: 80,
            maxWidth: '1000px',
          }}
        >
          {title}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
          }}
        >
          <div style={{ fontSize: 24, color: 'rgba(255, 255, 255, 0.7)' }}>
            Latest robotics news & reviews
          </div>
          <div style={{ fontSize: 26, fontWeight: 'bold', color: 'rgba(59, 130, 246, 1)' }}>
            awesomerobots.xyz
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
