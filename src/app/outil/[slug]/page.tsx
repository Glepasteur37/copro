import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { toolsConfig } from '../toolsConfig';
import ToolClient from './client';

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const tool = toolsConfig.find((t) => t.slug === params.slug);
  if (!tool) return {};
  return {
    title: `${tool.title} | Copro SaaS`,
    description: tool.description,
    openGraph: {
      title: `${tool.title} | Copro SaaS`,
      description: tool.ogDescription
    }
  };
}

export default function ToolPage({ params }: Props) {
  const tool = toolsConfig.find((t) => t.slug === params.slug);
  if (!tool) return notFound();
  return <ToolClient tool={tool} />;
}
