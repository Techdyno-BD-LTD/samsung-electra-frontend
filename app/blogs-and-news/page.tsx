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
  banner: string;
  banner_two: string;
  promo_banner: string;
  promo_link: string;
  status: number;
  created_at: string;
  category_name: string;
  category_slug: string;
}

export default function BlogsAndNewsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const response = await fetch('/api/blogs');
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          setBlogs(json.data);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

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

  const filteredBlogs = blogs.filter((blog) => {
    const query = searchQuery.toLowerCase();
    return (
      blog.title.toLowerCase().includes(query) ||
      blog.category_name.toLowerCase().includes(query)
    );
  });

  const recentBlogs = blogs.slice(0, 3);
  const displayedBlogs = filteredBlogs.slice(0, visibleCount);

  // Find the most recent blog that has a promo banner configured
  const activePromoBlog = blogs.find(b => b.promo_banner) || null;
  const promoBg = activePromoBlog?.promo_banner || '';
  const promoLink = activePromoBlog?.promo_link || '/shop';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-[#111111] mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Breadcrumb Navigation */}
      <div className="mainwidth mx-auto px-4 lg:px-0 pt-6 pb-2 mt-14">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-500 font-medium">Blog & News</span>
        </nav>
      </div>

      <div className="mainwidth mx-auto px-4 lg:px-0 pb-16">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-4">

          {/* Left: Blog Cards Grid */}
          <div className="lg:col-span-3 space-y-8">
            <h1 className="text-[28px] lg:text-[32px] font-bold text-[#111111] leading-tight">
              Our Blog & News
            </h1>

            {filteredBlogs.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
                <p className="text-gray-400 text-lg">No articles found matching your criteria.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-xs font-bold hover:bg-gray-200 transition-all"
                >
                  Clear Search Filter
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                  {displayedBlogs.map((blog) => (
                    <article key={blog.id} className="group flex flex-col w-full">
                      {/* Image Container */}
                      <Link
                        href={`/blogs-and-news/${blog.slug}`}
                        className="relative block aspect-[1.35/1] overflow-hidden rounded-[16px] bg-slate-50 border border-gray-100"
                      >
                        <Image
                          src={blog.banner || '/assets/img/placeholder.jpg'}
                          alt={blog.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                      </Link>

                      {/* Category Label */}
                      <div className="mt-3 text-[11px] text-[#6b7280] font-medium uppercase tracking-wide">
                        / {blog.category_name}
                      </div>

                      {/* Title */}
                      <h3 className="text-[16px] font-bold text-[#111111] line-clamp-2 mt-1 mb-3 hover:text-blue-600 transition-colors leading-snug">
                        <Link href={`/blogs-and-news/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h3>

                      {/* Author & Date Footer */}
                      <div className="flex items-center justify-between mt-auto pt-2">
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
                    </article>
                  ))}
                </div>

                {/* Loading Centered Spinner / More Loading */}
                {visibleCount < filteredBlogs.length && (
                  <div className="text-center pt-10 flex flex-col items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setIsPageLoading(true);
                        setTimeout(() => {
                          setVisibleCount((prev) => prev + 6);
                          setIsPageLoading(false);
                        }, 600);
                      }}
                      disabled={isPageLoading}
                      className="flex flex-col items-center justify-center gap-2 focus:outline-none"
                    >
                      <div className={`rounded-full h-6 w-6 border-2 border-gray-300 border-t-[#111111] ${isPageLoading ? 'animate-spin' : ''}`}></div>
                      <span className="text-[12px] font-bold text-gray-600 hover:text-black transition-colors">
                        {isPageLoading ? 'Loading...' : 'More Loading'}
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right: Sidebar */}
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
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-500 z-0"></div>
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] pointer-events-none z-0"></div>
              )}

              {/* Product Image */}
              <div className="w-full h-full flex items-center justify-center relative z-10">
                <div className="w-full max-w-[170px] relative h-[130px]">
                  <Image
                    src="/images/ov2.png"
                    alt="Electra Microwave Oven"
                    fill
                    sizes="170px"
                    className="object-contain group-hover:scale-103 transition-transform duration-500"
                  />
                </div>
              </div>
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}
