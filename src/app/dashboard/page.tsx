"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi, quotesApi, type Quote } from "@/infra/api";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TooltipItem
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const data = await quotesApi.getAll();
        setQuotes(data);
      } catch {
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  // Prepare chart data (top 10 quotes by votes)
  const topQuotes = [...quotes]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 10);

  const chartData = {
    labels: topQuotes.map(q => q.text.length > 20 ? q.text.slice(0, 20) + '…' : q.text),
    datasets: [
      {
        label: 'Votes',
        data: topQuotes.map(q => q.votes),
        backgroundColor: 'rgba(37, 99, 235, 0.7)', // blue-600
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Top 10 Quotes by Votes (visualize chart Requirement)',
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          title: (items: TooltipItem<'bar'>[]) => topQuotes[items[0].dataIndex].text,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Quote' },
      },
      y: {
        title: { display: true, text: 'Votes' },
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  // Calculate stats
  const totalQuotes = quotes.length;
  const totalVotes = quotes.reduce((sum, q) => sum + q.votes, 0);
  // Get recent quotes (sorted by created_at desc)
  const sortedQuotes = [...quotes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const [visibleCount, setVisibleCount] = useState(3);
  const recentQuotes = sortedQuotes.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, sortedQuotes.length));
  };

  // Handler functions for buttons
  const handleAddNewQuote = () => {
    router.push("/quotes");
  };

  const handleViewTopVoted = () => {
    router.push("/quotes");
  };

  const handleViewAllQuotes = () => {
    router.push("/quotes");
  };

  const handleLogout = () => {
    authApi.logout();
    router.push("/login");
  };

  const getUser = () => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };

  const user = getUser();

  // Count quotes created by the current user
  const userId = user?.id;
  const userQuotesCount = quotes.filter(q => q.created_by === userId).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Quote Vote Dashboard</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/quotes" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Quotes
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Chart Visualization */}
        <div className="bg-white shadow rounded-lg p-3 mb-4">
          <Bar data={chartData} options={chartOptions} height={100} />
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Quotes</dt>
                    <dd className="text-lg font-medium text-gray-900">{loading ? '...' : totalQuotes}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Votes</dt>
                    <dd className="text-lg font-medium text-gray-900">{loading ? '...' : totalVotes}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Your Quotes</dt>
                    <dd className="text-lg font-medium text-gray-900">{loading ? '...' : userQuotesCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Quotes */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Quotes</h3>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-gray-400">Loading...</div>
                ) : recentQuotes.length === 0 ? (
                  <div className="text-gray-400">No recent quotes.</div>
                ) : (
                  recentQuotes.map((quote) => (
                    <div key={quote.id} className="border-l-4 border-blue-500 pl-4">
                      <p className="text-sm text-gray-600">&ldquo;{quote.text}&rdquo;</p>
                      <p className="text-xs text-gray-400 mt-1">- {quote.author || 'Unknown'}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-6 space-y-2">
                {visibleCount < sortedQuotes.length && !loading && (
                  <button 
                    onClick={handleLoadMore}
                    className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Load More
                  </button>
                )}
                <button 
                  onClick={handleViewAllQuotes}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View All Quotes
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleAddNewQuote}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Add New Quote
                </button>
                <button 
                  onClick={handleViewTopVoted}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  View Top Voted
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 