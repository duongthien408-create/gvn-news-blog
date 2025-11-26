import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qibhlrsdykpkbsnelubz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// API helper functions
export const api = {
  // Get all posts (public only) with creator and tags
  async getPosts({ type = null, today = false } = {}) {
    let query = supabase
      .from('posts')
      .select(`
        *,
        creator:creators(*),
        post_tags(
          tag:tags(*)
        )
      `)
      .eq('status', 'public')
      .order('published_at', { ascending: false })

    // Filter by type (news/review)
    if (type) {
      query = query.eq('type', type)
    }

    // Filter today only
    if (today) {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      query = query.gte('published_at', todayStart.toISOString())
    }

    const { data, error } = await query
    if (error) throw error

    // Transform data to flatten tags
    return data?.map(post => ({
      ...post,
      tags: post.post_tags?.map(pt => pt.tag) || []
    })) || []
  },

  // Get single post by ID
  async getPostById(id) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        creator:creators(*),
        post_tags(
          tag:tags(*)
        )
      `)
      .eq('id', id)
      .eq('status', 'public')
      .single()

    if (error) throw error
    return {
      ...data,
      tags: data?.post_tags?.map(pt => pt.tag) || []
    }
  },

  // Get all creators
  async getCreators() {
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  },

  // Get single creator by slug
  async getCreatorBySlug(slug) {
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  },

  // Get posts by creator
  async getPostsByCreator(creatorId) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        creator:creators(*),
        post_tags(
          tag:tags(*)
        )
      `)
      .eq('creator_id', creatorId)
      .eq('status', 'public')
      .order('published_at', { ascending: false })

    if (error) throw error
    return data?.map(post => ({
      ...post,
      tags: post.post_tags?.map(pt => pt.tag) || []
    })) || []
  },

  // Get all tags
  async getTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  },

  // Get posts by tag
  async getPostsByTag(tagSlug) {
    const { data: tag } = await supabase
      .from('tags')
      .select('id')
      .eq('slug', tagSlug)
      .single()

    if (!tag) return []

    const { data, error } = await supabase
      .from('post_tags')
      .select(`
        post:posts(
          *,
          creator:creators(*),
          post_tags(
            tag:tags(*)
          )
        )
      `)
      .eq('tag_id', tag.id)

    if (error) throw error

    return data
      ?.map(pt => pt.post)
      .filter(post => post?.status === 'public')
      .map(post => ({
        ...post,
        tags: post.post_tags?.map(pt => pt.tag) || []
      })) || []
  }
}

export default supabase
