import Link from "next/link"
import { ArrowRight, FileText, Image, FileDown, Sparkles, Zap, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/20 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                DocuVault
              </span>
            </div>
            <Link
              href="/pdfs"
              className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors font-medium text-sm"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* Hero Section */}
        <section className="relative px-6 py-20 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 mb-8">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Modern Document Viewer</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Your Documents,
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Beautifully Viewed
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                Experience seamless document viewing with our modern interface. Browse PDFs, images, and Office documents directly from Google Drive with stunning visual clarity.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/pdfs"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                >
                  Open Library
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all">
                  <span>Learn More</span>
                </button>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border-y border-white/20 dark:border-slate-700/20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Everything you need for documents
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Built for modern teams who demand the best document viewing experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group">
                <div className="p-8 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">PDF Excellence</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Native PDF rendering with smooth scrolling, crisp text, and lightning-fast loading from Google Drive.
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="p-8 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6">
                    <Image className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Image Clarity</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    High-resolution image viewing with intelligent scaling and optimized loading for the best visual experience.
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="p-8 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-6">
                    <FileDown className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Office Docs</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Seamless viewing of Word, PowerPoint, and Excel documents with full formatting preservation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  Built for performance
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  Experience blazing-fast document loading with our optimized rendering engine and intelligent caching.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Lightning fast loading</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Secure Google Drive integration</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Beautiful, responsive design</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <div className="text-slate-500 dark:text-slate-400">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm font-medium">Document Preview</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to transform your document experience?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have upgraded their document viewing with our modern platform.
            </p>
            <Link
              href="/pdfs"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">DocuVault</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2024 DocuVault. Built with modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
