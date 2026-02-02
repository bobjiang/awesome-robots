import { ImageResponse } from 'next/og';
import { env } from '@/env.mjs';
import robots from '@/data/robots.json';
import { Robot } from '@/types/robot';

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

export default async function Image({ params }: Props) {
  const { id } = await params;
  const robot = (robots as Robot[]).find((r) => r.id === id);

  if (!robot) {
    // Return default OG image
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(to bottom right, #1e40af, #7c3aed)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}
          >
            Awesome Robots
          </div>
          <div
            style={{
              fontSize: 32,
              color: 'rgba(255, 255, 255, 0.9)',
              marginTop: 20,
            }}
          >
            Robot Not Found
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }

  // Generate price display
  const priceDisplay =
    typeof robot.price.starting === 'number'
      ? `From $${robot.price.starting.toLocaleString()}`
      : 'Request Quote';

  // Get category display
  const categoryDisplay = robot.category.charAt(0).toUpperCase() + robot.category.slice(1);

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
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              🤖 Awesome Robots
            </div>
            <div
              style={{
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.9)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '10px 20px',
                borderRadius: '8px',
              }}
            >
              {categoryDisplay}
            </div>
          </div>

          {/* Main content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                fontSize: 28,
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '600',
              }}
            >
              {robot.brand}
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                maxWidth: '900px',
              }}
            >
              {robot.name}
            </div>
            {robot.description && (
              <div
                style={{
                  fontSize: 28,
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.4,
                  maxWidth: '800px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {robot.description}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                fontSize: 42,
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '20px 40px',
                borderRadius: '12px',
              }}
            >
              {priceDisplay}
            </div>
            <div
              style={{
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              awesomerobots.xyz
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
