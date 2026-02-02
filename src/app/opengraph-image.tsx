import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';
export const alt = 'Awesome Robots - AI-Powered Robot Catalog';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            opacity: 0.5,
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
          }}
        >
          {/* Robot emoji */}
          <div
            style={{
              fontSize: 120,
              marginBottom: '30px',
            }}
          >
            🤖
          </div>

          {/* Main title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1.2,
              marginBottom: '20px',
            }}
          >
            Awesome Robots
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 36,
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.4,
              maxWidth: '900px',
              marginBottom: '40px',
            }}
          >
            Discover AI-Powered Robots for Research, Education & Industry
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>✓</span>
              <span>105+ Robots</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>✓</span>
              <span>15+ Brands</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>✓</span>
              <span>Compare & Quote</span>
            </div>
          </div>

          {/* Website URL */}
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255, 255, 255, 0.8)',
              marginTop: '60px',
              fontWeight: '600',
            }}
          >
            awesomerobots.xyz
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
