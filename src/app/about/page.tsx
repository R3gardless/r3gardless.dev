import { Metadata } from 'next';
import { Wrench, Code, Coffee, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About - r3gardless.dev',
  description: 'Learn more about developer r3gardless.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <Wrench className="size-20 mx-auto mb-4 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            🚧 Under Construction 🚧
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Working hard on the About page!
          </p>
        </div>

        {/* Construction Info */}
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <Code className="size-12 mx-auto text-blue-500" />
              <h3 className="text-lg font-semibold text-foreground">In Development</h3>
              <p className="text-muted-foreground text-sm">
                Coding hard for a better
                <br />
                user experience
              </p>
            </div>

            <div className="space-y-4">
              <Coffee className="size-12 mx-auto text-amber-500" />
              <h3 className="text-lg font-semibold text-foreground">Caffeinated</h3>
              <p className="text-muted-foreground text-sm">
                ☕️ Working day and night
                <br />
                with coffee by my side
              </p>
            </div>

            <div className="space-y-4">
              <Heart className="size-12 mx-auto text-red-500" />
              <h3 className="text-lg font-semibold text-foreground">Made with Love</h3>
              <p className="text-muted-foreground text-sm">
                💝 Crafted with love
                <br />
                and attention to detail
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            🎉 Coming Soon
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                👤 About Me
              </h3>
              <p className="text-muted-foreground">My story and development philosophy</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                🛠 Tech Stack
              </h3>
              <p className="text-muted-foreground">Technologies I use and tools I love</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                🚀 Project Stories
              </h3>
              <p className="text-muted-foreground">
                Projects I&apos;ve worked on and lessons learned
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                📬 Contact
              </h3>
              <p className="text-muted-foreground">
                Let&apos;s connect and build something amazing together!
              </p>
            </div>
          </div>
        </div>

        {/* Fun Message */}
        <div className="text-center p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-200/20">
          <h3 className="text-xl font-semibold mb-4 text-foreground">🎯 Hold On!</h3>
          <p className="text-muted-foreground mb-4">
            Please wait a bit more for the perfect About page.
            <br />
            How about exploring some blog posts in the meantime?
          </p>
          <div className="text-4xl">🔥 💻 ⚡️ 🎨 ✨</div>
        </div>
      </div>
    </div>
  );
}
