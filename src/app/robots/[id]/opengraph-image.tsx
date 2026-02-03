import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';
export const alt = 'Robot Product Image';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ id: string }>;
}

// Lightweight OG image without bundling robots.json (368KB)
export default async function Image({ params }: Props) {
  const { id } = await params;
  
  // Extract robot name from ID
  const name = id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          <div style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>
            Awesome Robots
          </div>
        </div>

        {/* Robot name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            lineHeight: 1.2,
            marginTop: 100,
            maxWidth: '900px',
          }}
        >
          {name}
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
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '600',
            }}
          >
            View Specs & Pricing →
          </div>
          <div style={{ fontSize: 26, fontWeight: 'bold', color: 'white' }}>
            awesomerobots.xyz
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
