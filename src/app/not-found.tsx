'use client';

import Link from 'next/link';
import { AlertTriangle, Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <AlertTriangle className="size-20 mx-auto mb-4 text-yellow-500 animate-bounce" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">🚫 404 Error 🚫</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Oops! This page seems to have gone missing!
          </p>
        </div>

        {/* Error Info */}
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <Search className="size-12 mx-auto text-blue-500" />
              <h3 className="text-lg font-semibold text-foreground">Lost?</h3>
              <p className="text-muted-foreground text-sm">
                The page you&apos;re looking for
                <br />
                doesn&apos;t exist anymore
              </p>
            </div>

            <div className="space-y-4">
              <AlertTriangle className="size-12 mx-auto text-yellow-500" />
              <h3 className="text-lg font-semibold text-foreground">Moved</h3>
              <p className="text-muted-foreground text-sm">
                🔄 Maybe it was moved
                <br />
                to a different location
              </p>
            </div>

            <div className="space-y-4">
              <Home className="size-12 mx-auto text-green-500" />
              <h3 className="text-lg font-semibold text-foreground">Go Home</h3>
              <p className="text-muted-foreground text-sm">
                🏠 Let&apos;s get you back
                <br />
                to familiar territory
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Options */}
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            🎯 Where to go next?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                🏠 Homepage
              </h3>
              <p className="text-muted-foreground mb-4">Start fresh from the beginning</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Home className="size-4" />
                Go Home
              </Link>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                📝 Blog Posts
              </h3>
              <p className="text-muted-foreground mb-4">
                Explore interesting articles and insights
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              >
                <Search className="size-4" />
                Browse Blog
              </Link>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                👤 About Me
              </h3>
              <p className="text-muted-foreground mb-4">
                Learn more about the developer behind this site
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <ArrowLeft className="size-4" />
                About Page
              </Link>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                🔙 Go Back
              </h3>
              <p className="text-muted-foreground mb-4">Return to where you came from</p>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/90 transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted focus-visible:ring-offset-2"
              >
                <ArrowLeft className="size-4" />
                Go Back
              </button>
            </div>
          </div>
        </div>

        {/* Fun Message */}
        <div className="text-center p-8 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl border border-red-200/20">
          <h3 className="text-xl font-semibold mb-4 text-foreground">🤔 Don&apos;t worry!</h3>
          <p className="text-muted-foreground mb-4">
            Even the best developers get lost sometimes.
            <br />
            Let&apos;s find you something interesting to read!
          </p>
          <div className="text-4xl">🔍 🏠 📚 ✨ 🚀</div>
        </div>
      </div>
    </div>
  );
}
