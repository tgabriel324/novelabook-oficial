
import SeoMetaTags, { SeoMetaTagsProps } from "./SeoMetaTags";
import { Novel } from "@/lib/data/types";

type NovelSeoTagsProps = {
  novel: Novel;
  baseUrl?: string;
};

const NovelSeoTags = ({ novel, baseUrl = "https://novelbook.app" }: NovelSeoTagsProps) => {
  // Construir as keywords baseadas nas categorias e tags da novela
  const keywords = [
    ...novel.categories,
    ...novel.tags,
    "novela online",
    "leitura",
    "ebook",
    novel.title,
    novel.author.name,
  ];

  // Configurar as propriedades SEO
  const seoProps: SeoMetaTagsProps = {
    title: `${novel.title} - NovelBook`,
    description: novel.description.length > 160 
      ? novel.description.substring(0, 157) + "..." 
      : novel.description,
    keywords,
    ogImage: novel.cover,
    ogUrl: `${baseUrl}/livro/${novel.id}`,
    ogType: "book",
    twitterCard: "summary_large_image",
    canonical: `${baseUrl}/livro/${novel.id}`,
    author: novel.author.name,
    publishedTime: novel.publishedAt || novel.createdAt,
  };

  return <SeoMetaTags {...seoProps} />;
};

export default NovelSeoTags;
