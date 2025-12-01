import { useState, useEffect } from 'react';
import { X, Link2, Loader2, Check, AlertCircle, Tag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const SubmitModal = ({ isOpen, onClose, tags = [], onSuccess }) => {
  const { user, profile, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    url: '',
    title: '',
    summary: '',
    thumbnail_url: '',
    selectedTags: [],
  });

  const [urlMeta, setUrlMeta] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        url: '',
        title: '',
        summary: '',
        thumbnail_url: '',
        selectedTags: [],
      });
      setUrlMeta(null);
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Detect platform from URL
  const detectPlatform = (url) => {
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube';
      if (hostname.includes('tiktok.com')) return 'tiktok';
      if (hostname.includes('facebook.com') || hostname.includes('fb.com')) return 'facebook';
      if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
      return 'blog';
    } catch {
      return 'blog';
    }
  };

  // Extract video ID for YouTube thumbnails
  const getYouTubeThumbnail = (url) => {
    try {
      const urlObj = new URL(url);
      let videoId = null;

      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v');
        if (!videoId && urlObj.pathname.includes('/shorts/')) {
          videoId = urlObj.pathname.split('/shorts/')[1]?.split('/')[0];
        }
      } else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      }

      if (videoId) {
        return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
      }
    } catch {}
    return null;
  };

  // Fetch URL metadata
  const fetchUrlMeta = async (url) => {
    if (!url) return;

    try {
      new URL(url);
    } catch {
      return;
    }

    setFetchingMeta(true);
    const platform = detectPlatform(url);

    // For YouTube, get thumbnail directly
    if (platform === 'youtube') {
      const thumbnail = getYouTubeThumbnail(url);
      setUrlMeta({ platform, thumbnail });
      setFormData(prev => ({
        ...prev,
        thumbnail_url: thumbnail || '',
      }));
    } else {
      setUrlMeta({ platform });
    }

    setFetchingMeta(false);
  };

  // Handle URL change with debounce
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, url }));

    // Debounce fetch
    clearTimeout(window.urlFetchTimeout);
    window.urlFetchTimeout = setTimeout(() => {
      fetchUrlMeta(url);
    }, 500);
  };

  // Toggle tag selection
  const toggleTag = (tagId) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter(id => id !== tagId)
        : [...prev.selectedTags, tagId],
    }));
  };

  // Check if domain is trusted (for auto-approve)
  const checkTrustedDomain = async (url) => {
    try {
      const hostname = new URL(url).hostname.replace('www.', '');
      const { data } = await supabase
        .from('trusted_domains')
        .select('auto_approve')
        .eq('domain', hostname)
        .single();
      return data?.auto_approve || false;
    } catch {
      return false;
    }
  };

  // Submit post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Vui lòng đăng nhập để submit');
      return;
    }

    if (!formData.url) {
      setError('Vui lòng nhập URL');
      return;
    }

    if (!formData.title) {
      setError('Vui lòng nhập tiêu đề');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check for duplicate
      const { data: existing } = await supabase
        .from('posts')
        .select('id')
        .eq('source_url', formData.url)
        .single();

      if (existing) {
        setError('URL này đã được submit trước đó');
        setLoading(false);
        return;
      }

      // Check if auto-approve
      const isTrusted = await checkTrustedDomain(formData.url);
      const shouldAutoApprove = profile?.is_verified || profile?.reputation >= 100 || isTrusted;

      const platform = detectPlatform(formData.url);
      const postType = platform === 'youtube' || platform === 'tiktok' ? 'review' : 'news';

      // Insert post
      const { data: post, error: insertError } = await supabase
        .from('posts')
        .insert({
          source: 'community',
          platform,
          type: postType,
          status: shouldAutoApprove ? 'public' : 'pending',
          auto_approved: shouldAutoApprove,
          submitted_by: user.id,
          title: formData.title,
          title_vi: formData.title, // User submits in Vietnamese
          summary: formData.summary,
          summary_vi: formData.summary,
          source_url: formData.url,
          thumbnail_url: formData.thumbnail_url,
          created_at: new Date().toISOString(),
          published_at: shouldAutoApprove ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Insert tags
      if (formData.selectedTags.length > 0 && post) {
        const tagInserts = formData.selectedTags.map(tagId => ({
          post_id: post.id,
          tag_id: tagId,
        }));

        await supabase.from('post_tags').insert(tagInserts);
      }

      setSuccess(true);

      // Callback to refresh posts
      if (onSuccess) {
        onSuccess();
      }

      // Close after 2s
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80" onClick={onClose} />
        <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="mt-4 text-lg font-bold text-white">Cần đăng nhập</h3>
          <p className="mt-2 text-sm text-zinc-400">
            Vui lòng đăng nhập để submit bài viết
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80" onClick={onClose} />
        <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-white">Đã submit thành công!</h3>
          <p className="mt-2 text-sm text-zinc-400">
            Bài viết của bạn đang chờ duyệt
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6 py-4">
          <h2 className="text-lg font-bold text-white">Submit bài viết</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* URL */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">
              URL bài viết / video *
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <input
                type="url"
                value={formData.url}
                onChange={handleUrlChange}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-4 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
              />
              {fetchingMeta && (
                <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-zinc-500" />
              )}
            </div>
            {urlMeta && (
              <p className="mt-1.5 text-xs text-zinc-500">
                Platform: <span className="text-zinc-300">{urlMeta.platform}</span>
              </p>
            )}
          </div>

          {/* Thumbnail Preview */}
          {formData.thumbnail_url && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                Thumbnail
              </label>
              <img
                src={formData.thumbnail_url}
                alt="Thumbnail"
                className="h-32 w-full rounded-lg object-cover"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">
              Tiêu đề *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Nhập tiêu đề bài viết"
              maxLength={200}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">
              Mô tả ngắn
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Mô tả ngắn về nội dung..."
              rows={3}
              maxLength={500}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
              <Tag className="h-4 w-4" />
              Chọn tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    formData.selectedTags.includes(tag.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                  }`}
                >
                  #{tag.name.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !formData.url || !formData.title}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 py-3 font-medium text-white transition hover:from-red-600 hover:to-orange-600 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Đang submit...
              </>
            ) : (
              'Submit bài viết'
            )}
          </button>

          <p className="text-center text-xs text-zinc-500">
            Bài viết sẽ được kiểm duyệt trước khi hiển thị
          </p>
        </form>
      </div>
    </div>
  );
};

export default SubmitModal;
