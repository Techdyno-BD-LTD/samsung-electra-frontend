'use client';


import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';
import popularProducts from '@/database/popularproducts.json';
import RecentViewedProductCard from '@/components/productdetails/RecentViewedProductCard';

type ProductSpecification = {
  label?: string;
  value?: string;
};

type ProductFeatureSection = {
  title?: string;
  description?: string;
  image?: string | null;
  text?: string | null;
  icon?: string | null;
};

type ProductReviewItem = {
  id?: number;
  reviewer_name?: string | null;
  reviewer_image?: string | null;
  rating?: number | null;
  comment?: string | null;
  created_at?: string | null;
  name?: string | null;
  title?: string | null;
  body?: string | null;
  score?: number | string | null;
};

type ProductReviews = {
  total?: number;
  average?: number;
  breakdown?: Array<{ star: number; count: number }>;
  items?: ProductReviewItem[];
};

type ProductDetailsTabsProps = {
  productId?: number;
  title?: string;
  descriptionHtml?: string;
  specificationsHtml?: string;
  featureHtml?: string;
  policyHtml?: string;
  descriptionText?: string;
  specifications?: ProductSpecification[];
  featureSections?: ProductFeatureSection[];
  policyTitle?: string;
  policyContent?: string;
  reviews?: ProductReviews;
};

function isHtmlContent(value?: string): boolean {
  return /<[^>]+>/.test(value ?? '');
}

function splitPlainText(value?: string): string[] {
  return (value ?? '')
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export default function ProductDetailsTabs({
  productId,
  title,
  descriptionHtml,
  specificationsHtml,
  featureHtml,
  policyHtml,
  descriptionText,
  specifications,
  featureSections,
  policyTitle,
  policyContent,
  reviews,
}: ProductDetailsTabsProps) {
  const { isAuthenticated, user, token } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('description');

  // Review states
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      setSubmitMessage({ type: 'error', text: 'Please login to submit a review' });
      return;
    }

    if (rating === 0) {
      setSubmitMessage({ type: 'error', text: 'Please select a rating' });
      return;
    }

    if (!comment.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please share your feedback' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/v2/reviews/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          product_id: productId,
          rating: rating,
          comment: comment,
          title: reviewTitle // Though backend might not use title yet, we send it
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage({ type: 'success', text: 'Review submitted successfully! It will be visible after admin approval.' });
        setRating(0);
        setReviewTitle('');
        setComment('');
      } else {
        setSubmitMessage({ type: 'error', text: data.message || 'Failed to submit review' });
      }
    } catch {
      setSubmitMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  const descriptionRef = useRef<HTMLDivElement>(null);
  const specificationsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const policyRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'description', label: 'Description', ref: descriptionRef },
    { id: 'specifications', label: 'Specifications', ref: specificationsRef },
    { id: 'features', label: 'Features', ref: featuresRef },
    { id: 'reviews', label: `Review (${reviews?.total ?? reviews?.items?.length ?? 0})`, ref: reviewsRef },
    { id: 'policy', label: 'Product Policy', ref: policyRef },
  ];

  const [recentViewedItems, setRecentViewedItems] = useState<any[]>(
    (popularProducts as any[]).slice(0, 3)
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem('recently_viewed_products');
      if (stored) {
        const list = JSON.parse(stored);
        const filtered = list.filter((item: any) => item.id !== productId);
        if (filtered.length > 0) {
          setRecentViewedItems(filtered.slice(0, 3));
        }
      }
    } catch (err) {
      console.error('Failed to load recently viewed products', err);
    }
  }, [productId]);

  const headingTitle = title ?? 'Samsung Front Loading Washing Machine- 8KG | WW80AGAS21AXLP';
  const reviewSummary = reviews ?? {};
  const totalReviews = reviewSummary.total ?? reviewSummary.items?.length ?? 0;
  const averageRating = reviewSummary.average ?? 0;
  const reviewBreakdown = reviewSummary.breakdown ?? [];
  const reviewItems = (reviewSummary.items ?? []).map((item) => {
    const reviewerName = item.reviewer_name?.trim() || item.name?.trim() || 'Anonymous';
    const reviewTitle = item.title?.trim() || 'Review';
    const reviewBody = item.body?.trim() || item.comment?.trim() || '';
    const reviewScore = item.score != null ? String(item.score) : `(${Number(item.rating ?? 0).toFixed(1)})`;

    return {
      name: reviewerName,
      title: reviewTitle,
      body: reviewBody,
      score: reviewScore,
      reviewerImage: item.reviewer_image ?? null,
    };
  });

  const featureCards = featureSections ?? [];
  const hasDescriptionHtml = isHtmlContent(descriptionHtml);
  const hasPolicyHtml = isHtmlContent(policyHtml);
  const policyHeading = policyTitle ?? 'Product Policy';
  const descriptionBlocks = descriptionText ? splitPlainText(descriptionText) : [];
  let specificationRows: any[] = [];
  if (Array.isArray(specifications)) {
    specificationRows = specifications;
  } else if (typeof specifications === 'string') {
    try {
      const parsed = JSON.parse(specifications);
      if (Array.isArray(parsed)) {
        specificationRows = parsed;
      }
    } catch {
      specificationRows = [];
    }
  }
  const fallbackReviewRows = [
    { star: 5, count: 0 },
    { star: 4, count: 0 },
    { star: 3, count: 0 },
    { star: 2, count: 0 },
    { star: 1, count: 0 },
  ];
  const breakdownRows = (reviewBreakdown.length > 0 ? reviewBreakdown : fallbackReviewRows).map((row) => ({
    ...row,
    width: totalReviews > 0 ? `${Math.max(2, Math.round((row.count / totalReviews) * 100))}%` : '2%',
  }));

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    const id = tabs.find((tab) => tab.ref === ref)?.id ?? 'description';
    setActiveTab(id);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const sectionRefs = [descriptionRef, specificationsRef, featuresRef, reviewsRef, policyRef];
    const sectionIds = ['description', 'specifications', 'features', 'reviews', 'policy'];

    const onScroll = () => {
      for (let i = 0; i < sectionRefs.length; i += 1) {
        const node = sectionRefs[i].current;
        if (!node) {
          continue;
        }

        const rect = node.getBoundingClientRect();
        if (rect.top <= 110 && rect.bottom > 110) {
          setActiveTab(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="mx-auto mt-10">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="border border-slate-300 bg-white">
          <div className="border-b border-slate-300 px-4 py-3 text-center">
            <h2 className="text-[14px] font-semibold leading-tight text-slate-900 md:text-[20px]">
              {headingTitle}
            </h2>
          </div>

          <div className="px-2 pb-3 pt-3 sm:px-3 sm:pb-4 sm:pt-4">
            <div className="mb-5 grid grid-cols-5 gap-1.5 sm:mb-6 sm:gap-2.5 lg:mb-8 lg:gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => scrollToSection(tab.ref)}
                  className={`w-full min-w-0 truncate whitespace-nowrap rounded-md px-0.5 py-1.5 text-center text-[10px] font-semibold leading-tight transition sm:px-1 sm:text-[11px] lg:rounded-lg lg:px-0 lg:py-3 lg:text-sm ${activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-10">
              <div ref={descriptionRef} className="scroll-mt-32">
                {hasDescriptionHtml ? (
                  <div
                    className="text-gray-900 [&_p]:mb-4 [&_p]:text-[13px] [&_p]:leading-relaxed sm:[&_p]:mb-5 sm:[&_p]:text-[14px] lg:[&_p]:text-[16px]"
                    dangerouslySetInnerHTML={{
                      __html: descriptionHtml ?? '<p>Product description is not available right now.</p>',
                    }}
                  />
                ) : descriptionBlocks.length > 0 ? (
                  <div className="space-y-3 text-gray-900">
                    {descriptionBlocks.map((block, index) => (
                      <p key={`${block}-${index}`} className="text-[13px] leading-relaxed sm:text-[14px] lg:text-[16px]">
                        {block}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] leading-relaxed text-slate-500 sm:text-[14px] lg:text-[16px]">
                    Product description is not available right now.
                  </p>
                )}
              </div>

              <div ref={specificationsRef} className="scroll-mt-32 -mt-1">
                {specificationRows.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left [&_tr]:border [&_tr]:border-slate-300 [&_td]:px-2 [&_td]:py-1.5 [&_td]:text-[12px] [&_td]:text-slate-800 sm:[&_td]:px-2.5 sm:[&_td]:py-2 sm:[&_td]:text-[13px] lg:[&_td]:px-3 lg:[&_td]:py-2 lg:[&_td]:text-[14px] [&_td:first-child]:w-1/4 [&_td:first-child]:bg-slate-50 [&_td:first-child]:font-semibold">
                      <tbody>
                        {specificationRows.map((row, index) => (
                          <tr key={`${row.label ?? 'spec'}-${index}`}>
                            <td>{row.label ?? 'Specifications'}</td>
                            <td>{row.value ?? 'Not available'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : specificationsHtml ? (
                  <div
                    className="overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_tr]:border [&_tr]:border-slate-300 [&_td]:px-2 [&_td]:py-1.5 [&_td]:text-[12px] [&_td]:text-slate-800 sm:[&_td]:px-2.5 sm:[&_td]:py-2 sm:[&_td]:text-[13px] lg:[&_td]:px-3 lg:[&_td]:py-2 lg:[&_td]:text-[14px] [&_td:first-child]:w-1/4 [&_td:first-child]:bg-slate-50 [&_td:first-child]:font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: specificationsHtml,
                    }}
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left [&_tr]:border [&_tr]:border-slate-300 [&_td]:px-2 [&_td]:py-1.5 [&_td]:text-[12px] [&_td]:text-slate-800 sm:[&_td]:px-2.5 sm:[&_td]:py-2 sm:[&_td]:text-[13px] lg:[&_td]:px-3 lg:[&_td]:py-2 lg:[&_td]:text-[14px] [&_td:first-child]:w-1/4 [&_td:first-child]:bg-slate-50 [&_td:first-child]:font-semibold">
                      <tbody>
                        <tr>
                          <td>Specifications</td>
                          <td>Not available</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div ref={featuresRef} className="scroll-mt-32">
                <h2 className="mb-3 bg-slate-100 py-1.5 text-center text-[16px] font-semibold text-slate-900 sm:mb-4 sm:py-2 sm:text-[18px] lg:text-xl">
                  Features
                </h2>
                {featureCards.length > 0 ? (
                  <div className="space-y-4 text-slate-700">
                    {featureCards.map((feature, index) => {
                      const featureTitle = feature.title ?? feature.text ?? 'Feature';
                      const featureDescription = feature.description ?? '';
                      const featureImage = feature.image ?? feature.icon ?? '';

                      return (
                        <article key={`${featureTitle}-${index}`} className="rounded border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="flex flex-col gap-4  lg:items-start">
                            <div>
                              <h3 className="mb-1.5 text-[16px] font-semibold sm:text-[20px] lg:text-[24px]">
                                {featureTitle}
                              </h3>
                              {featureDescription ? (
                                <p className="text-[12px] leading-relaxed text-slate-700 sm:text-[14px] lg:text-[16px]">
                                  {featureDescription}
                                </p>
                              ) : (
                                <p className="text-[12px] leading-relaxed text-slate-500 sm:text-[14px] lg:text-[16px]">
                                  Feature description is not available right now.
                                </p>
                              )}
                              {featureImage ? (
                                <div className="relative mt-5 lg:h-96 h-36 w-full overflow-hidden">
                                  <Image src={featureImage} alt={featureTitle} fill className="object-fit" />
                                </div>
                              ) : null}
                            </div>


                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : featureHtml ? (
                  <div
                    className="space-y-4 text-slate-700 [&_h2]:hidden [&_h3]:mb-1.5 [&_h3]:text-[16px] [&_h3]:font-semibold sm:[&_h3]:text-[20px] lg:[&_h3]:text-[24px] [&_h4]:mb-1 [&_h4]:text-[13px] [&_h4]:font-medium sm:[&_h4]:text-[15px] lg:[&_h4]:text-[18px] [&_p]:mb-2 [&_p]:text-[12px] [&_p]:leading-relaxed sm:[&_p]:text-[14px] lg:[&_p]:text-[16px] [&_img]:mt-2 [&_img]:w-full [&_img]:rounded-sm [&_img]:object-cover sm:[&_img]:mt-3"
                    dangerouslySetInnerHTML={{
                      __html: featureHtml,
                    }}
                  />
                ) : (
                  <p className="text-[12px] leading-relaxed text-slate-500 sm:text-[14px] lg:text-[16px]">
                    Features section placeholder.
                  </p>
                )}
              </div>

              <div ref={reviewsRef} className="scroll-mt-32">
                <h2 className="mb-4 bg-slate-100 py-1.5 text-center text-[15px] font-semibold text-slate-900">
                  Reviews
                </h2>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.6fr]">
                  <div className="rounded border border-slate-300 bg-white p-3">
                    <div className="grid grid-cols-[72px_1px_1fr] items-center gap-3 border-b border-slate-200 pb-3">
                      <div className="text-center">
                        <p className="text-[26px] font-semibold text-slate-900">{averageRating.toFixed(1)}/5</p>
                        <p className="text-[13px] text-orange-500">★★★★★</p>
                        <p className="text-[13px] text-slate-700">{Math.round((averageRating / 5) * 100)}% Rating</p>
                      </div>

                      <div className="h-full bg-slate-300" />

                      <div>
                        {breakdownRows.map((row) => (
                          <div key={row.star} className="mb-1.5 flex items-center gap-2">
                            <span className="w-14 text-xs text-orange-500">{'★★★★★'.slice(0, row.star).padEnd(5, '☆')}</span>
                            <span className="h-1.5 flex-1 rounded bg-slate-200">
                              <span className="block h-1.5 rounded bg-orange-500" style={{ width: row.width }} />
                            </span>
                            <span className="w-8 text-right text-xs text-slate-600">({row.count})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <h3 className="mb-1.5 mt-4 text-[15px] font-semibold text-slate-900">Add Reviews</h3>
                    <div className="mb-2 flex items-center gap-1.5">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="text-[18px] focus:outline-none"
                          >
                            <span className={star <= (hoverRating || rating) ? 'text-orange-500' : 'text-slate-300'}>
                              {star <= (hoverRating || rating) ? '★' : '☆'}
                            </span>
                          </button>
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">( add rating )</span>
                    </div>

                    <input
                      className="mb-2 w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                      placeholder="Your Name"
                      value={user?.name || ''}
                      readOnly
                    />
                    <input
                      className="mb-2 w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                      placeholder="Please Enter Your Review Title"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                    />
                    <textarea
                      className="mb-2.5 w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                      rows={3}
                      placeholder="Please Share Your Feedback About The Product."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />

                    {submitMessage && (
                      <div className={`mb-2.5 text-xs p-2 rounded ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {submitMessage.text}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSubmitReview}
                        disabled={isSubmitting}
                        className={`rounded bg-[#2F7FE8] px-4 py-1.5 text-xs font-semibold text-white transition-opacity ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </div>

                  <div className="rounded border border-slate-300 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">Reviews from real people</h3>
                      <select className="rounded border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700">
                        <option>Default</option>
                      </select>
                    </div>
                    <p className="mb-2.5 text-xs text-slate-500">{totalReviews} Reviews</p>

                    {reviewItems.length > 0 ? (
                      reviewItems.map((item, index) => (
                        <article key={`${item.name}-${index}`} className="border-t border-slate-200 py-3 first:border-t-0 first:pt-0">
                          <p className="text-[13px] font-medium text-slate-900">{item.name}</p>
                          <p className="text-orange-500">★★★★★ <span className="text-[11px] text-slate-500">{item.score}</span></p>
                          <p className="text-[13px] font-semibold text-slate-900">{item.title}</p>
                          <p className="text-[12px] text-slate-700">{item.body}</p>
                        </article>
                      ))
                    ) : (
                      <p className="text-[12px] text-slate-500">No reviews available right now.</p>
                    )}
                  </div>
                </div>
              </div>

              <div ref={policyRef} id="policy-section" className="scroll-mt-32">
                <h2 className="mb-3 bg-slate-100 py-1.5 text-center text-[14px] font-semibold text-slate-900 sm:mb-4 sm:text-[15px] lg:text-base">
                  {policyHeading}
                </h2>

                {policyContent ? (
                  hasPolicyHtml ? (
                    <div
                      className="text-slate-800 [&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:text-[18px] [&_h3]:font-semibold sm:[&_h3]:mt-3 sm:[&_h3]:text-[24px] lg:[&_h3]:text-[30px] [&_h4]:mb-1 [&_h4]:mt-2 [&_h4]:text-[14px] [&_h4]:font-semibold sm:[&_h4]:mt-3 sm:[&_h4]:text-[17px] lg:[&_h4]:text-[20px] [&_p]:mb-1 [&_p]:text-[12px] [&_p]:leading-relaxed sm:[&_p]:text-[14px] lg:[&_p]:text-[16px] [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 sm:[&_ul]:mb-3 sm:[&_ul]:pl-5 [&_li]:mb-0.5 [&_li]:text-[12px] [&_li]:leading-relaxed sm:[&_li]:text-[14px] lg:[&_li]:text-[16px]"
                      dangerouslySetInnerHTML={{
                        __html: policyContent,
                      }}
                    />
                  ) : (
                    <div className="space-y-2 text-slate-800">
                      {splitPlainText(policyContent).map((line, index) => (
                        <p key={`${line}-${index}`} className="text-[12px] leading-relaxed sm:text-[14px] lg:text-[16px]">
                          {line}
                        </p>
                      ))}
                    </div>
                  )
                ) : policyHtml ? (
                  <div
                    className="text-slate-800 [&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:text-[18px] [&_h3]:font-semibold sm:[&_h3]:mt-3 sm:[&_h3]:text-[24px] lg:[&_h3]:text-[30px] [&_h4]:mb-1 [&_h4]:mt-2 [&_h4]:text-[14px] [&_h4]:font-semibold sm:[&_h4]:mt-3 sm:[&_h4]:text-[17px] lg:[&_h4]:text-[20px] [&_p]:mb-1 [&_p]:text-[12px] [&_p]:leading-relaxed sm:[&_p]:text-[14px] lg:[&_p]:text-[16px] [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 sm:[&_ul]:mb-3 sm:[&_ul]:pl-5 [&_li]:mb-0.5 [&_li]:text-[12px] [&_li]:leading-relaxed sm:[&_li]:text-[14px] lg:[&_li]:text-[16px]"
                    dangerouslySetInnerHTML={{
                      __html: policyHtml,
                    }}
                  />
                ) : (
                  <p className="text-[12px] leading-relaxed text-slate-500 sm:text-[14px] lg:text-[16px]">
                    Product policy is not available right now.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className=" ">
            <h3 className="mb-3 border border-slate-300 py-2 text-center text-[18px] font-semibold text-slate-900">
              Recent View Products
            </h3>

            <div className="space-y-4">
              {recentViewedItems.map((item, index) => (
                <RecentViewedProductCard key={`${item.title ?? 'recent'}-${index}`} product={item} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
