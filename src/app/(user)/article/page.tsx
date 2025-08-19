// app/articles/page.tsx
"use client";

import { ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";

type Article = {
  id: string;
  title: string;
  content?: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  category?: {
    id: string;
    name: string;
  };
  user?: {
    username: string;
  };
};

type Category = {
  id: string;
  name: string;
};

const ITEMS_PER_PAGE = 9;

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState(1);

  // debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  // fetch articles
  useEffect(() => {
    async function fetchArticles() {
      const res = await fetch(
        "https://test-fe.mysellerpintar.com/api/articles"
      );
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : data.data ?? []);
    }
    fetchArticles();
  }, []);

  // fetch categories
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch(
        "https://test-fe.mysellerpintar.com/api/categories"
      );
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.data ?? []);
    }
    fetchCategories();
  }, []);

  // filter + search
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchCategory = selectedCategory
        ? a.category?.id === selectedCategory
        : true;
      const matchSearch = a.title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [articles, selectedCategory, debouncedSearch]);

  // pagination
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center">
        <div
          className="relative bg-cover bg-center h-[560px] md:h-[530px] lg:h-[500px] flex items-center justify-center text-center"
          style={{
            backgroundImage: `url('/image/hero.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-primary/85 bg-opacity-30" />
          <div className="relative z-10">
            <div className="space-y-3">
              <h3 className="font-bold text-white">Blog Genzet</h3>
              <h1 className="mt-3 text-white text-4xl lg:text-5xl font-medium max-w-3xl md:max-w-[730px] mx-auto">
                The Journal: Design Resources & Industry News
              </h1>
              <p className="text-white text-lg lg:text-2xl font-normal">
                The Journal: Design Resources & Industry News
              </p>
            </div>
            <div className="bg-primary-500 rounded-xl p-4 mt-10 w-full max-w-3xl mx-auto flex gap-4">
              <div className="relative flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 pr-10 rounded text-black appearance-none"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none"
                  size={20}
                />
              </div>

              {/* Search Input dengan Icon */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search articles"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-2 pl-10 rounded text-black"
                />
                <Search
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-black"
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Artikel */}
      <div className="px-[100px] pt-10 pb-[100px]">
        <p className="mb-4 text-sm text-gray-500">
          Showing {paginatedArticles.length} of {filteredArticles.length}{" "}
          articles
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg overflow-hidden transition"
            >
              {article.imageUrl && (
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                  width={1000}
                  height={1000}
                />
              )}
              <div className="p-4 space-y-2">
                <p className="text-xs text-gray-400">
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h2 className="font-semibold text-lg">{article.title}</h2>
                <p
                  className="text-gray-600 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {article.category && (
                    <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                      {article.category.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8 items-center">
            {/* Prev button */}
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded border ${
                page === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white"
              }`}
            >
              Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .map((p) => {
                if (
                  p === 1 ||
                  p === totalPages ||
                  p === page ||
                  p === page - 1 ||
                  p === page + 1
                ) {
                  return p;
                }
                return null;
              })
              .map((p, idx, arr) => {
                if (p === null) {
                  // Jika ada gap, cek apakah sebelumnya bukan null → tambahkan "..."
                  if (arr[idx - 1] !== null) return "...";
                  return null;
                }
                return (
                  <button
                    key={p + idx}
                    onClick={() => setPage(p as number)}
                    className={`px-3 py-1 rounded border ${
                      page === p ? "bg-blue-600 text-white" : "bg-white"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

            {/* Next button */}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded border ${
                page === totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
