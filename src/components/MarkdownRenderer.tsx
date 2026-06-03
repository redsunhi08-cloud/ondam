import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split content by lines and parse simple markdown elements
  const lines = content.split('\n');

  return (
    <div className="space-y-4 text-brand-muted leading-relaxed font-sans text-sm md:text-base">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        // Empty line
        if (trimmed === '') {
          return <div key={index} className="h-2" />;
        }

        // Horizontal rule
        if (trimmed === '---') {
          return <hr key={index} className="border-t border-brand-border my-6" />;
        }

        // Headers: ### (H3)
        if (trimmed.startsWith('###')) {
          const text = trimmed.replace('###', '').trim();
          return (
            <h3 key={index} className="text-lg md:text-xl font-semibold text-primary font-manrope tracking-tight mt-6 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-gold rounded-full inline-block"></span>
              {parseBoldText(text)}
            </h3>
          );
        }

        // Headers: ## (H2)
        if (trimmed.startsWith('##')) {
          const text = trimmed.replace(/^##\s*/, '').trim();
          return (
            <h2 key={index} className="text-xl md:text-2xl font-bold text-primary font-manrope tracking-tight mt-8 mb-4 border-b border-brand-border pb-2 flex items-center gap-2">
              {parseBoldText(text)}
            </h2>
          );
        }

        // Bullet point
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const text = trimmed.substring(2).trim();
          return (
            <ul key={index} className="list-disc list-inside ml-4 space-y-1 my-1">
              <li className="text-brand-muted text-sm md:text-base">
                {parseBoldText(text)}
              </li>
            </ul>
          );
        }

        // Standard Paragraph
        return (
          <p key={index} className="text-brand-muted leading-relaxed text-sm md:text-base">
            {parseBoldText(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

// Simple helper to parse **bold** text in markdown lines
function parseBoldText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => {
    // Every odd item is the captured group within **
    if (i % 2 === 1) {
      return (
        <strong key={i} className="font-semibold text-primary">
          {part}
        </strong>
      );
    }
    return part;
  });
}
export default MarkdownRenderer;
