
import { Helmet } from "react-helmet";

export type SeoMetaTagsProps = {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogUrl?: string;
  ogType?: "website" | "article" | "book" | "profile";
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  noIndex?: boolean;
  canonical?: string;
  author?: string;
  publishedTime?: string;
};

const SeoMetaTags = ({
  title = "NovelBook - Sua plataforma de novelas online",
  description = "Descubra, leia e compartilhe as melhores novelas online. NovelBook oferece uma experiência de leitura imersiva com recursos avançados.",
  keywords = ["novelas", "leitura online", "livros", "ebooks", "literatura", "histórias"],
  ogImage = "/og-image.png",
  ogUrl = "https://novelbook.app",
  ogType = "website",
  twitterCard = "summary_large_image",
  noIndex = false,
  canonical,
  author = "NovelBook",
  publishedTime,
}: SeoMetaTagsProps) => {
  // Construa a URL canônica
  const canonicalUrl = canonical || ogUrl;

  return (
    <Helmet>
      {/* Metadados básicos */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content={author} />
      
      {/* Controle de indexação */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Link canônico */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="NovelBook" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={ogUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Artigos/Livros - metadados adicionais */}
      {ogType === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === "book" && (
        <meta property="book:author" content={author} />
      )}
      
      {/* Tags de cores para navegadores móveis */}
      <meta name="theme-color" content="#9b87f5" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Viewport otimizado */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
    </Helmet>
  );
};

export default SeoMetaTags;
