import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Play,
  ExternalLink,
  Sparkles,
  User,
  Calendar,
  Hash,
  Share2,
  BookOpen,
} from "lucide-react";
import { api } from "../lib/supabase";

// Format tag name (all lowercase)
const formatTagName = (name) => name.toLowerCase();

// Reading time calculation
const calculateReadTime = (content) => {
  if (!content) return 5;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Simple markdown to HTML converter
const renderMarkdown = (content) => {
  if (!content) return null;

  // Split content into lines
  const lines = content.split('\n');
  const elements = [];
  let currentParagraph = [];
  let currentList = [];

  // Parse inline bold **text** into spans
  const parseInlineBold = (text) => {
    const parts = [];
    let lastIndex = 0;
    const regex = /\*\*(.+?)\*\*/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      // Add bold text
      parts.push(
        <span key={match.index} className="font-semibold text-white">
          {match[1]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ').trim();
      if (text) {
        elements.push(
          <p key={elements.length} className="mb-4 text-base leading-relaxed text-zinc-300">
            {parseInlineBold(text)}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={elements.length} className="mb-4 ml-4 list-disc space-y-1 text-zinc-300">
          {currentList.map((item, i) => (
            <li key={i} className="text-base leading-relaxed">
              {parseInlineBold(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Heading 2: ##
    if (trimmed.startsWith('## ')) {
      flushParagraph();
      flushList();
      elements.push(
        <h2 key={elements.length} className="mb-4 mt-8 text-2xl font-bold text-white">
          {trimmed.slice(3)}
        </h2>
      );
      return;
    }

    // Heading 3: ###
    if (trimmed.startsWith('### ')) {
      flushParagraph();
      flushList();
      elements.push(
        <h3 key={elements.length} className="mb-3 mt-6 text-xl font-bold text-white">
          {trimmed.slice(4)}
        </h3>
      );
      return;
    }

    // Heading 4: ####
    if (trimmed.startsWith('#### ')) {
      flushParagraph();
      flushList();
      elements.push(
        <h4 key={elements.length} className="mb-2 mt-4 text-lg font-semibold text-white">
          {trimmed.slice(5)}
        </h4>
      );
      return;
    }

    // Bullet list: * or -
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      flushParagraph();
      currentList.push(trimmed.slice(2));
      return;
    }

    // Empty line = paragraph/list break
    if (trimmed === '') {
      flushParagraph();
      flushList();
      return;
    }

    // If we have a list going and this isn't a list item, flush it
    if (currentList.length > 0) {
      flushList();
    }

    // Regular text
    currentParagraph.push(trimmed);
  });

  // Flush remaining content
  flushParagraph();
  flushList();

  return elements;
};

const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle click on backdrop (outside article content)
  const handleBackdropClick = (e) => {
    // Only trigger if clicking directly on the backdrop, not on article content
    if (e.target === e.currentTarget) {
      navigate("/?tab=articles"); // Go back to articles tab
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const data = await api.getArticleBySlug(slug);
        setArticle(data);
      } catch (err) {
        console.error("Failed to fetch article:", err);
        setError("Article not found");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 rounded bg-zinc-800" />
            <div className="h-12 w-3/4 rounded bg-zinc-800" />
            <div className="h-64 rounded-xl bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-4 rounded bg-zinc-800" />
              <div className="h-4 rounded bg-zinc-800" />
              <div className="h-4 w-2/3 rounded bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
            <h1 className="mb-2 text-xl font-bold text-white">
              Article Not Found
            </h1>
            <p className="text-zinc-500">
              The article you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const readTime = calculateReadTime(article.content);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Clickable backdrop on sides */}
      <div
        className="fixed inset-0 z-0 cursor-pointer"
        onClick={handleBackdropClick}
        title="Click to go back"
      />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to GearVN Hub</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-purple-500 hover:text-purple-400"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </header>

      <article className="relative z-10 mx-auto max-w-4xl bg-zinc-950 px-4 py-8">
        {/* AI Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-400">
            <Sparkles className="h-4 w-4" />
            AI Generated Article
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-6 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
          {article.creator && (
            <div className="flex items-center gap-2">
              {article.creator.avatar_url ? (
                <img
                  src={article.creator.avatar_url}
                  alt={article.creator.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800">
                  <User className="h-4 w-4 text-zinc-500" />
                </div>
              )}
              <span className="font-medium text-zinc-300">
                {article.creator.name}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(article.published_at || article.created_at)}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {readTime} min read
          </div>
        </div>

        {/* Hero Image */}
        {article.thumbnail_url && (
          <div className="relative mb-8 overflow-hidden rounded-2xl">
            <img
              src={article.thumbnail_url}
              alt={article.title}
              className="aspect-video w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent" />
          </div>
        )}

        {/* Source Video Link */}
        {article.source_url && (
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-red-500/50 hover:bg-zinc-800/50"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-500">
              <Play className="h-6 w-6 text-white" fill="white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Based on video review
              </p>
              <p className="truncate text-sm font-medium text-white">
                {article.source_video_title || "Watch original video"}
              </p>
            </div>
            <ExternalLink className="h-5 w-5 flex-shrink-0 text-zinc-500" />
          </a>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <p className="mb-8 border-l-4 border-purple-500 pl-4 text-lg font-medium leading-relaxed text-zinc-300">
            {article.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-invert prose-zinc max-w-none">
          {renderMarkdown(article.content)}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 border-t border-zinc-800 pt-8">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Hash className="h-4 w-4" />
              <span>Tags:</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/?tag=${tag.slug}`}
                  className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-purple-500/20 hover:text-purple-400"
                >
                  #{formatTagName(tag.name)}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Card */}
        {article.creator && (
          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-start gap-4">
              {article.creator.avatar_url ? (
                <img
                  src={article.creator.avatar_url}
                  alt={article.creator.name}
                  className="h-16 w-16 rounded-full"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
                  <User className="h-8 w-8 text-zinc-500" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Original Creator
                </p>
                <h3 className="mt-1 text-lg font-bold text-white">
                  {article.creator.name}
                </h3>
                {article.creator.channel_url && (
                  <a
                    href={article.creator.channel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm text-red-500 hover:underline"
                  >
                    <Play className="h-4 w-4" />
                    View YouTube Channel
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Back to articles */}
        <div className="mt-12 text-center">
          <Link
            to="/?tab=articles"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition hover:border-purple-500 hover:text-purple-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 bg-zinc-900/50 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-xs text-zinc-600">
            This article was generated by AI based on video transcript.
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Powered by GearVN News & Review Hub
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ArticlePage;
