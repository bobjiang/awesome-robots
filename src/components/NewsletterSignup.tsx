'use client'

import Script from 'next/script'

interface NewsletterSignupProps {
  className?: string
}

export default function NewsletterSignup({ className }: NewsletterSignupProps) {
  return (
    <div className={className}>
      <iframe
        src="https://embeds.beehiiv.com/ccd23b92-3d64-4f8c-b267-8a69739700af"
        data-test-id="beehiiv-embed"
        width="100%"
        height="320"
        frameBorder="0"
        scrolling="no"
        style={{
          borderRadius: '4px',
          border: '2px solid #e5e7eb',
          margin: 0,
          backgroundColor: 'transparent',
        }}
      />
      <Script
        src="https://embeds.beehiiv.com/js/opt-in-library.js"
        strategy="lazyOnload"
        data-test-id="beehiiv-script"
      />
    </div>
  )
}
