import { useState, useEffect } from 'react';
import {
  Shield,
  Check,
  X,
  ExternalLink,
  Clock,
  User,
  Filter,
  RefreshCw,
  ChevronLeft,
  Play,
  Newspaper,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const AdminPanel = ({ onBack }) => {
  const { isAdmin, isModerator } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, public, all
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch pending posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('source', 'community')
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('status', 'pending');
      } else if (filter === 'public') {
        query = query.eq('status', 'public');
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  // Approve post
  const handleApprove = async (postId) => {
    setActionLoading(postId);
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          status: 'public',
          published_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;

      // Remove from list or update status
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, status: 'public' } : p
      ));
    } catch (error) {
      console.error('Error approving post:', error);
      alert('Lỗi khi duyệt bài: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Reject post
  const handleReject = async (postId, reason = '') => {
    setActionLoading(postId);
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          status: 'rejected',
          rejection_reason: reason || 'Không phù hợp với nội dung'
        })
        .eq('id', postId);

      if (error) throw error;

      // Remove from list
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Error rejecting post:', error);
      alert('Lỗi khi từ chối bài: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete post
  const handleDelete = async (postId) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;

    setActionLoading(postId);
    try {
      // Delete post_tags first
      await supabase.from('post_tags').delete().eq('post_id', postId);

      // Delete post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Lỗi khi xóa bài: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Check permission
  if (!isAdmin && !isModerator) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500" />
        <h2 className="mt-4 text-xl font-bold text-white">Không có quyền truy cập</h2>
        <p className="mt-2 text-zinc-400">Bạn cần quyền Admin hoặc Moderator</p>
        <button
          onClick={onBack}
          className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const pendingCount = posts.filter(p => p.status === 'pending').length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-lg bg-zinc-800 p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold text-white">
              <Shield className="h-6 w-6 text-red-500" />
              Admin Panel
            </h1>
            <p className="text-sm text-zinc-400">
              Quản lý bài viết từ cộng đồng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPosts}
            className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('pending')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            filter === 'pending'
              ? 'bg-yellow-500/20 text-yellow-500'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          <Clock className="h-4 w-4" />
          Chờ duyệt
          {pendingCount > 0 && (
            <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs text-black">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilter('public')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            filter === 'public'
              ? 'bg-green-500/20 text-green-500'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          <Check className="h-4 w-4" />
          Đã duyệt
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            filter === 'all'
              ? 'bg-zinc-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          <Filter className="h-4 w-4" />
          Tất cả
        </button>
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800">
          <Clock className="h-12 w-12 text-zinc-600" />
          <p className="mt-3 text-zinc-500">
            {filter === 'pending' ? 'Không có bài viết chờ duyệt' : 'Không có bài viết'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
            >
              <div className="flex gap-4">
                {/* Thumbnail */}
                {post.thumbnail_url && (
                  <div className="hidden h-24 w-40 flex-shrink-0 overflow-hidden rounded-lg sm:block">
                    <img
                      src={post.thumbnail_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {/* Type badge */}
                    <span className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
                      post.type === 'review'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {post.type === 'review' ? <Play className="h-3 w-3" /> : <Newspaper className="h-3 w-3" />}
                      {post.type === 'review' ? 'Review' : 'News'}
                    </span>

                    {/* Platform */}
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                      {post.platform}
                    </span>

                    {/* Status */}
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                      post.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : post.status === 'public'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {post.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 font-medium text-white line-clamp-2">
                    {post.title_vi || post.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(post.created_at).toLocaleString('vi-VN')}
                    </span>
                    <a
                      href={post.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Xem nguồn
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 flex-col gap-2">
                  {post.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(post.id)}
                        disabled={actionLoading === post.id}
                        className="flex items-center gap-1.5 rounded-lg bg-green-500/20 px-3 py-1.5 text-sm font-medium text-green-400 transition hover:bg-green-500/30 disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(post.id)}
                        disabled={actionLoading === post.id}
                        className="flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-1.5 text-sm font-medium text-red-400 transition hover:bg-red-500/30 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                        Từ chối
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={actionLoading === post.id}
                    className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-700 hover:text-white disabled:opacity-50"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
