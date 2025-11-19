import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qibhlrsdykpkbsnelubz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for common queries
export const api = {
  // Posts
  async getPosts(filters = {}) {
    let query = supabase
      .from('posts')
      .select(`
        *,
        post_creators(
          creators(id, name, slug, avatar_url, verified)
        ),
        post_tags(
          tags(id, name, slug, icon_name)
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getPostBySlug(slug) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_creators(
          creators(id, name, slug, avatar_url, verified, bio)
        ),
        post_tags(
          tags(id, name, slug, icon_name)
        ),
        post_products(
          products(*, brands(*), product_categories(*))
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) throw error
    return data
  },

  // Creators
  async getCreators() {
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .order('total_followers', { ascending: false })

    if (error) throw error
    return data
  },

  async getCreatorBySlug(slug) {
    const { data, error } = await supabase
      .from('creators')
      .select(`
        *,
        creator_socials(*)
      `)
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  },

  // Tags
  async getTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('post_count', { ascending: false })

    if (error) throw error
    return data
  },

  async getTagBySlug(slug) {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  },

  // Products
  async getProducts() {
    const { data, error} = await supabase
      .from('products')
      .select(`
        *,
        brands(*),
        product_categories(*)
      `)
      .eq('status', 'available')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Comments
  async getCommentsByPostId(postId) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users(id, username, user_profiles(display_name, avatar_url))
      `)
      .eq('post_id', postId)
      .is('parent_id', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Authentication
  async signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    })

    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }
}

export default supabase
