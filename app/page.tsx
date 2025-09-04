import Link from "next/link"
import { ArrowRight, FileText, Image, FileDown, Sparkles, Zap, Shield, BookOpen, Scroll } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-red-100/50 dark:from-slate-900 dark:via-amber-900/10 dark:to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/20 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                <Scroll className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                जैन ग्रंथ संग्रह
              </span>
            </div>
            <Link
              href="/pdfs"
              className="px-4 py-2 rounded-lg bg-orange-700 dark:bg-amber-600 text-white hover:bg-orange-800 dark:hover:bg-amber-700 transition-colors font-medium text-sm"
            >
              ग्रंथ अध्ययन करें
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
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">जैन धर्म ग्रंथ संग्रह</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                जैन साहित्य का
                <br />
                <span className="bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 bg-clip-text text-transparent">
                  डिजिटल खजाना
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                प्राचीन जैन ग्रंथों, हस्तलिखित पांडुलिपियों और प्रकाशित पुस्तकों का अध्ययन करें। आगम सूत्र, स्तोत्र, कथा ग्रंथ और अन्य पवित्र साहित्य को डिजिटल रूप में सुरक्षित रखा गया है।
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/pdfs"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105"
                >
                  ग्रंथ संग्रह देखें
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-orange-300 dark:border-amber-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-orange-50 dark:hover:bg-amber-900/20 transition-all">
                  <BookOpen className="w-5 h-5" />
                  <span>अधिक जानकारी</span>
                </button>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border-y border-white/20 dark:border-slate-700/20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                जैन साहित्य के विशेष संग्रह
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                प्राचीन हस्तलिखित पांडुलिपियों से लेकर आधुनिक प्रकाशित ग्रंथों तक का संपूर्ण संग्रह
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group">
                <div className="p-8 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6">
                    <Scroll className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">हस्तलिखित पांडुलिपियां</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    सैकड़ों वर्ष पुरानी हस्तलिखित पांडुलिपियों का उच्च गुणवत्ता में संरक्षण। प्राचीन लिपियों और भाषाओं का अध्ययन करें।
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="p-8 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">आगम सूत्र</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    श्वेतांबर और दिगंबर परंपरा के आगम सूत्रों का संपूर्ण संग्रह। तत्त्वार्थ सूत्र, कल्प सूत्र, और अन्य मुख्य ग्रंथ।
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="p-8 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center mb-6">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">स्तोत्र और कथा ग्रंथ</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    पवित्र स्तोत्र, भक्ति गीत, तीर्थंकरों की कथाएं और जैन इतिहास के महत्वपूर्ण ग्रंथों का संग्रह।
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
                  धार्मिक अध्ययन हेतु उन्नत सुविधाएं
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  जैन धर्म के गहन अध्ययन के लिए विशेष रूप से डिजाइन किया गया डिजिटल प्लेटफॉर्म। शोधकर्ताओं और साधकों के लिए उपयुक्त।
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">तीव्र गति से ग्रंथ लोडिंग</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">सुरक्षित भंडारण और पहुंच</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">उत्कृष्ट पठन अनुभव</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-orange-50 to-amber-100 dark:from-amber-900/20 dark:to-orange-900/20 border border-orange-200 dark:border-amber-700 flex items-center justify-center">
                  <div className="text-orange-600 dark:text-amber-400">
                    <Scroll className="w-16 h-16 mx-auto mb-4 opacity-70" />
                    <p className="text-sm font-medium">ग्रंथ अवलोकन</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              जैन धर्म के पवित्र ग्रंथों का अध्ययन आरंभ करें
            </h2>
            <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
              हजारों शोधकर्ता, विद्यार्थी और साधक इस डिजिटल संग्रह का उपयोग कर जैन साहित्य का गहन अध्ययन कर रहे हैं।
            </p>
            <Link
              href="/pdfs"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-orange-600 font-semibold hover:bg-orange-50 transition-all duration-300 hover:scale-105"
            >
              अध्ययन प्रारंभ करें
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                <Scroll className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">जैन ग्रंथ संग्रह</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2024 जैन ग्रंथ संग्रह। धार्मिक साहित्य के संरक्षण हेतु समर्पित।
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
