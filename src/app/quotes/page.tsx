"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { quotesApi, type Quote, authApi } from "@/infra/api";

export default function QuotesList() {
    const router = useRouter();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("votes");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [isLoading, setIsLoading] = useState(true);
    const [visibleQuotes, setVisibleQuotes] = useState(10);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newQuote, setNewQuote] = useState({ text: "", author: "" });
    const [votedQuotes, setVotedQuotes] = useState<Set<number>>(new Set());
    const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
    const [currentUser, setCurrentUser] = useState<{ id: number } | null>(null);

    const handleLogout = () => {
        authApi.logout();
        router.push("/login");
    };

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const data = await quotesApi.getAll();

                setQuotes(data);

                // Check vote status for each quote
                const voteStatus = new Set<number>();
                for (const quote of data) {
                    const hasVoted = await quotesApi.hasUserVoted(quote.id);
                    if (hasVoted) {
                        voteStatus.add(quote.id);
                    }
                }
                setVotedQuotes(voteStatus);
            } catch (error) {
                console.error("Error fetching quotes:", error);
                setQuotes([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuotes();
    }, []);

    useEffect(() => {
        const user = authApi.getCurrentUser();
        // console.log("Current user after refresh:", user);
        setCurrentUser(user);
    }, []);

    // Filter and sort quotes
    const processedQuotes = useMemo(() => {
        const filtered = quotes.filter(quote => {
            const matchesSearch = quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quote.author.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });

        filtered.sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case "votes":
                    aValue = a.votes;
                    bValue = b.votes;
                    break;
                case "author":
                    aValue = a.author;
                    bValue = b.author;
                    break;
                case "date":
                    aValue = new Date(a.created_at).getTime();
                    bValue = new Date(b.created_at).getTime();
                    break;
                default:
                    aValue = a.votes;
                    bValue = b.votes;
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [quotes, searchTerm, sortBy, sortOrder]);

    useEffect(() => {
        setFilteredQuotes(processedQuotes.slice(0, visibleQuotes));
    }, [processedQuotes, visibleQuotes]);

    const handleVote = async (quoteId: number) => {
        try {
            await quotesApi.vote(quoteId);
            // Update local state after successful API call
            setQuotes(prev => prev.map(quote =>
                quote.id === quoteId ? { ...quote, votes: quote.votes + 1 } : quote
            ));
            // Mark as voted
            setVotedQuotes(prev => new Set([...prev, quoteId]));
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    const isDisabledVote = (quoteId: number) => {
        return votedQuotes.has(quoteId);
    };

    const openAddModal = () => {
        setNewQuote({ text: "", author: "" });
        setEditingQuote(null);
        setShowAddModal(true);
    };

    const openEditModal = (quote: Quote) => {
        setNewQuote({ text: quote.text, author: quote.author });
        setEditingQuote(quote);
        setShowAddModal(true);
    };

    const handleAddOrEditQuote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingQuote) {
            // Edit mode
            try {
                const updated = await quotesApi.update(editingQuote.id, {
                    text: newQuote.text,
                    author: newQuote.author
                });
                setQuotes(prev => prev.map(q => q.id === updated.id ? updated : q));
                setEditingQuote(null);
                setNewQuote({ text: "", author: "" });
                setShowAddModal(false);
            } catch (error) {
                console.error("Error updating quote:", error);
            }
        } else {
            // Add mode
            try {
                const newQuoteItem = await quotesApi.create({
                    text: newQuote.text,
                    author: newQuote.author
                });
                setQuotes(prev => [newQuoteItem, ...prev]);
                setNewQuote({ text: "", author: "" });
                setShowAddModal(false);
            } catch (error) {
                console.error("Error adding quote:", error);
            }
        }
    };

    const loadMore = () => {
        setVisibleQuotes(prev => prev + 10);
    };

    const sortOptions = [
        { value: "votes", label: "Votes" },
        { value: "author", label: "Author" },
        { value: "date", label: "Date" }
    ];

    if (isLoading) {
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
                            <h1 className="text-xl font-semibold text-gray-900">Quotes Library</h1>
                        </div>
                        <nav className="flex space-x-8">
                            <Link href="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                Home
                            </Link>
                            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                Dashboard
                            </Link>
                            <Link href="/quotes" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
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

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Controls */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <input
                                type="text"
                                placeholder="Search quotes or authors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Showing {filteredQuotes.length} of {processedQuotes.length} quotes
                        </p>
                        <button
                            onClick={openAddModal}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Add New Quote
                        </button>
                    </div>
                </div>

                {/* Quotes List */}
                <div className="space-y-4">
                    {filteredQuotes.map(quote => (
                        <div key={quote.id} className="bg-white shadow rounded-lg p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="text-lg text-gray-900 mb-2">&ldquo;{quote.text}&rdquo;</p>
                                    <p className="text-sm text-gray-600">- {quote.author}</p>
                                    <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                                        <span>Added: {new Date(quote.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    <span className="text-lg font-semibold text-gray-900">{quote.votes}</span>
                                    <button
                                        onClick={() => handleVote(quote.id)}
                                        disabled={isDisabledVote(quote.id)}
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${isDisabledVote(quote.id)
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-green-600 text-white hover:bg-green-700'
                                            }`}
                                    >
                                        {isDisabledVote(quote.id) ? 'Voted' : 'Vote'}
                                    </button>
                                    {currentUser && quote.created_by === currentUser.id && (
                                        <button
                                            onClick={() => openEditModal(quote)}
                                            className="px-3 py-1 rounded-md text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                {visibleQuotes < processedQuotes.length && (
                    <div className="text-center mt-6">
                        <button
                            onClick={loadMore}
                            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Load More Quotes
                        </button>
                    </div>
                )}
            </main>

            {/* Add Quote Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">{editingQuote ? 'Edit Quote' : 'Add New Quote'}</h3>
                        <form onSubmit={handleAddOrEditQuote}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quote Text</label>
                                    <textarea
                                        required
                                        value={newQuote.text}
                                        onChange={(e) => setNewQuote(prev => ({ ...prev, text: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                        placeholder="Enter the quote text..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                                    <input
                                        required
                                        type="text"
                                        value={newQuote.author}
                                        onChange={(e) => setNewQuote(prev => ({ ...prev, author: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter the author name..."
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    {editingQuote ? 'Update Quote' : 'Add Quote'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); setEditingQuote(null); }}
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 
