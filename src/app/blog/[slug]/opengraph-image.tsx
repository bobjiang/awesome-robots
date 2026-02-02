import { ImageResponse } from 'next/og';
import { posts } from '#site/content';

// Route segment config
export const runtime = 'edge';
export const alt = 'Blog Post Image';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
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
            Awesome Robots Blog
          </div>
          <div
            style={{
              fontSize: 32,
              color: 'rgba(255, 255, 255, 0.9)',
              marginTop: 20,
            }}
          >
            Post Not Found
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }

  // Format date
  const postDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
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
                fontSize: 28,
                fontWeight: 'bold',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              📰 Awesome Robots Blog
            </div>
            <div
              style={{
                fontSize: 22,
                color: 'rgba(255, 255, 255, 0.9)',
                backgroundColor: 'rgba(59, 130, 246, 0.3)',
                padding: '10px 20px',
                borderRadius: '8px',
                border: '2px solid rgba(59, 130, 246, 0.5)',
              }}
            >
              {post.category}
            </div>
          </div>

          {/* Main content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '40px' }}>
            <div
              style={{
                fontSize: 56,
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                maxWidth: '1000px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {post.title}
            </div>
            {post.excerpt && (
              <div
                style={{
                  fontSize: 26,
                  color: 'rgba(255, 255, 255, 0.75)',
                  lineHeight: 1.4,
                  maxWidth: '900px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {post.excerpt}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: '600',
                  color: 'rgba(59, 130, 246, 1)',
                }}
              >
                {post.author}
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                {postDate}
              </div>
            </div>
            <div
              style={{
                fontSize: 22,
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
