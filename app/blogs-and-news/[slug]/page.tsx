'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoSearchOutline } from 'react-icons/io5';

interface Blog {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  description_two: string | null;
  banner: string;
  banner_two: string;
  promo_banner: string;
  promo_link: string;
  status: number;
  created_at: string;
  category_name: string;
  category_slug: string;
}

export default function BlogDetailsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [detailsRes, listRes] = await Promise.all([
          fetch(`/api/blogs/${slug}`),
          fetch('/api/blogs')
        ]);

        if (detailsRes.ok) {
          const detailsJson = await detailsRes.json();
          if (detailsJson.success && detailsJson.data && detailsJson.data.length > 0) {
            setBlog(detailsJson.data[0]);
          }
        }

        if (listRes.ok) {
          const listJson = await listRes.json();
          if (listJson.success && Array.isArray(listJson.data)) {
            setRecentBlogs(listJson.data.slice(0, 3));
          }
        }
      } catch (error) {
        console.error('Error fetching blog details:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/blogs-and-news?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-[#111111] mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-[#111111] mb-4">Blog Post Not Found</h1>
        <p className="text-gray-500 mb-8">The blog post you are looking for does not exist or has been deleted.</p>
        <Link
          href="/blogs-and-news"
          className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg text-xs font-bold transition-colors"
        >
          Return to Blog & News
        </Link>
      </div>
    );
  }

  // Find the first available promo banner background
  const promoBg = blog.promo_banner || recentBlogs.find(b => b.promo_banner)?.promo_banner || '';
  const promoLink = blog.promo_link || recentBlogs.find(b => b.promo_link)?.promo_link || '/shop';

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Breadcrumb Navigation */}
      <div className="mainwidth mx-auto px-4 lg:px-0 pt-6 pb-2 mt-10">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-500 font-medium">Blog details</span>
        </nav>
      </div>

      <div className="mainwidth mx-auto px-4 lg:px-0 pb-16">
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-4">

          {/* Left Content Column */}
          <div className="lg:col-span-3 space-y-6">

            {/* Blog Post Title */}
            <h1 className="text-2xl lg:text-[34px] font-semibold text-[#111111] leading-tight">
              {blog.title}
            </h1>

            {/* Author info & Date */}
            <div className="flex items-center gap-6 text-[11px] text-gray-400 font-medium pb-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#f3f4f6] flex items-center justify-center text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </span>
                <div className="flex flex-col text-[10px]">
                  <span className="text-gray-400 leading-tight">Writing by</span>
                  <span className="text-[#374151] font-semibold leading-tight">Electra International</span>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-medium self-end mb-0.5">
                {formatDate(blog.created_at)}
              </span>
            </div>

            {/* Large Banner Image 1 */}
            <div className="w-full rounded-[16px] overflow-hidden bg-slate-50 border border-gray-100 shadow-sm aspect-[21/10] relative">
              <Image
                src={blog.banner || '/assets/img/placeholder.jpg'}
                alt={blog.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Section 1 Content Block */}
            <div className="prose max-w-none text-black leading-relaxed py-2">
              <div
                dangerouslySetInnerHTML={{ __html: blog.description || '' }}
                className="blog-detail-content text-[20px] leading-relaxed text-[#000000]"
              />
            </div>

            {/* Section 2 Content Block (Image 2 + Content 2 in 2-Column Split Layout) */}
            {blog.banner_two || blog.description_two ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                {/* Left Column: Image 2 */}
                <div className="w-full rounded-[16px] overflow-hidden bg-slate-50 border border-gray-100 shadow-sm aspect-[1.3/1] relative">
                  <Image
                    src={blog.banner_two || '/assets/img/placeholder.jpg'}
                    alt="Product Demonstration"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Right Column: Content Section 2 */}
                <div className="prose max-w-none text-black leading-relaxed">
                  <div
                    dangerouslySetInnerHTML={{ __html: blog.description_two || '' }}
                    className="blog-detail-content text-[20px] leading-relaxed text-[#000000]"
                  />
                </div>
              </div>
            ) : null}

            {/* Global Styled CSS overrides for rich content */}
            <style jsx global>{`
              .blog-detail-content h1 {
                font-size: 1.75rem;
                font-weight: 700;
                color: #000000;
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
              }
              .blog-detail-content h2, .blog-detail-content h3 {
                font-size: 1.35rem;
                font-weight: 700;
                color: #000000;
                margin-top: 1.25rem;
                margin-bottom: 0.5rem;
              }
              .blog-detail-content p {
                margin-bottom: 1rem;
                font-size: 20px;
                color: #000000;
                line-height: 1.8;
              }
              .blog-detail-content ul {
                list-style-type: disc;
                padding-left: 1.25rem;
                margin-bottom: 1rem;
              }
              .blog-detail-content ol {
                list-style-type: decimal;
                padding-left: 1.25rem;
                margin-bottom: 1rem;
              }
              .blog-detail-content li {
                margin-bottom: 0.4rem;
                font-size: 20px;
                color: #000000;
                line-height: 1.8;
              }
              .blog-detail-content blockquote {
                border-left: 3px solid #000000;
                padding-left: 1rem;
                font-style: italic;
                font-size: 20px;
                color: #000000;
                margin: 1rem 0;
              }
              .blog-detail-content img {
                border-radius: 12px;
                margin: 1.5rem 0;
                max-width: 100%;
                height: auto;
              }
            `}</style>

          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">

            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="flex h-10 w-full border border-gray-300 rounded overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search category"
                className="flex-1 px-3 text-xs bg-white focus:outline-none text-[#111111] placeholder:text-gray-400"
              />
              <button type="submit" className="bg-black text-white px-3.5 flex items-center justify-center hover:bg-gray-800 transition-colors">
                <IoSearchOutline className="text-sm stroke-[3]" />
              </button>
            </form>

            {/* Recent Posts Section */}
            <div className="pt-2">
              <span className="text-[14px] text-[#111111] font-bold block mb-1">
                Recent post
              </span>
              <div className="border-b border-gray-200 mb-4"></div>

              <div className="space-y-4">
                {recentBlogs.length === 0 ? (
                  <p className="text-xs text-gray-400">No recent posts available.</p>
                ) : (
                  recentBlogs.map((post) => (
                    <div key={post.id} className="flex gap-3 group">
                      <Link
                        href={`/blogs-and-news/${post.slug}`}
                        className="flex-shrink-0 w-20 h-16 rounded-md overflow-hidden bg-slate-50 border border-gray-100 relative"
                      >
                        <Image
                          src={post.banner || '/assets/img/placeholder.jpg'}
                          alt={post.title}
                          fill
                          sizes="80px"
                          className="object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-gray-500 font-medium uppercase">
                            / {post.category_name}
                          </span>
                          <h5 className="text-xs font-bold text-[#111111] group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mt-0.5">
                            <Link href={`/blogs-and-news/${post.slug}`}>{post.title}</Link>
                          </h5>
                        </div>
                        <span className="text-[9px] text-gray-400 block mt-1">
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Promo Banner Card */}
            <Link
              href={promoLink}
              className="relative block bg-[#0b0b0b] text-white rounded-[16px] overflow-hidden p-6 aspect-[3/4] shadow-sm mt-8 group bg-cover bg-center"
              style={promoBg ? { backgroundImage: `url(${promoBg})` } : undefined}
            >
              {promoBg ? (
                <div className="absolute inset-0 bg-black/10  transition-colors duration-500 z-0"></div>
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] pointer-events-none z-0"></div>
              )}

              {/* Product Image */}


            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}
