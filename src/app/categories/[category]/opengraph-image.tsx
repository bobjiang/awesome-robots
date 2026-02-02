import { ImageResponse } from 'next/og';
import categoriesData from '@/data/categories.json';

// Route segment config
export const runtime = 'edge';
export const alt = 'Category Page Image';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ category: string }>;
}

// Category emoji mapping
const categoryEmojis: Record<string, string> = {
  humanoid: '🧍',
  quadruped: '🐕',
  accessory: '🔧',
  other: '🤖',
};

// Category gradient colors
const categoryGradients: Record<string, { from: string; to: string }> = {
  humanoid: { from: '#667eea', to: '#764ba2' },
  quadruped: { from: '#f093fb', to: '#f5576c' },
  accessory: { from: '#4facfe', to: '#00f2fe' },
  other: { from: '#43e97b', to: '#38f9d7' },
};

export default async function Image({ params }: Props) {
  const { category } = await params;
  const categoryData = categoriesData.find((c) => c.id === category);

  if (!categoryData) {
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
            Category Not Found
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }

  const gradient = categoryGradients[category] || categoryGradients.other;
  const emoji = categoryEmojis[category] || categoryEmojis.other;
  const categoryName = categoryData.name;
  const categoryDescription = categoryData.description || `Explore our ${categoryName} collection`;

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
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
              Category
            </div>
          </div>

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '30px',
            }}
          >
            <div
              style={{
                fontSize: 120,
              }}
            >
              {emoji}
            </div>
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
              }}
            >
              {categoryName}
            </div>
            <div
              style={{
                fontSize: 32,
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.4,
                maxWidth: '800px',
              }}
            >
              {categoryDescription}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                fontSize: 28,
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '600',
              }}
            >
              Browse Collection →
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
