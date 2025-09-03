"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

// Load HTMLFlipBook dynamically to avoid SSR issues
const HTMLFlipBook: any = dynamic(() => import("react-pageflip"), {
  ssr: false,
})

let pdfjsLib: any = null

export default function ReaderPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [pages, setPages] = useState<HTMLCanvasElement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [bookKey, setBookKey] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const flipBookRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)

        if (!pdfjsLib) {
          // Load PDF.js from CDN to avoid bundling issues
          if (typeof window !== 'undefined' && !(window as any).pdfjsLib) {
            const script = document.createElement('script')
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
            document.head.appendChild(script)
            
            await new Promise((resolve, reject) => {
              script.onload = resolve
              script.onerror = reject
            })
            
            pdfjsLib = (window as any).pdfjsLib
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
          } else {
            pdfjsLib = (window as any).pdfjsLib
          }
        }

        const pdfUrl = `/api/pdf/${encodeURIComponent(id)}`
        const getDocument = (pdfjsLib as any).getDocument || (pdfjsLib as any)?.default?.getDocument
        const task = getDocument ? getDocument(pdfUrl) : (pdfjsLib as any).getDocument(pdfUrl)
        const pdf = await task.promise

        const canvases: HTMLCanvasElement[] = []
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum)
          const desiredWidth = 800
          const viewport = page.getViewport({ scale: 1 })
          const scale = desiredWidth / viewport.width
          const scaled = page.getViewport({ scale })

          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")
          canvas.width = scaled.width
          canvas.height = scaled.height

          await page.render({ canvasContext: ctx, viewport: scaled }).promise
          canvases.push(canvas)
          if (cancelled) return
        }

        if (!cancelled) {
          setPages(canvases)
          setTotalPages(canvases.length)
          setBookKey(prev => prev + 1) // Force re-render of the book
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load PDF")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  function requestFullscreen() {
    const el = containerRef.current || document.documentElement
    const anyEl = el as any
    ;(
      anyEl.requestFullscreen ||
      anyEl.webkitRequestFullscreen ||
      anyEl.mozRequestFullScreen ||
      anyEl.msRequestFullscreen
    )?.call(anyEl)
  }

  const onFlip = (e: any) => {
    setCurrentPage(e.data)
  }

  const nextPage = () => {
    if (isMobile) {
      setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))
    } else if (flipBookRef.current) {
      flipBookRef.current.getPageFlip().flipNext()
    }
  }

  const prevPage = () => {
    if (isMobile) {
      setCurrentPage(prev => Math.max(prev - 1, 0))
    } else if (flipBookRef.current) {
      flipBookRef.current.getPageFlip().flipPrev()
    }
  }



  return (
    <main className="min-h-screen bg-background">
      <div className="reader-header mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Reader</h1>
          <p className="text-muted-foreground text-sm">Flip through pages like an ebook</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={requestFullscreen} className="bg-primary text-primary-foreground hover:opacity-90">
            Enter Fullscreen
          </Button>
        </div>
      </div>

      <div ref={containerRef} className="mx-auto max-w-6xl px-4 pb-8">
        {loading && <div className="text-center text-muted-foreground">Loading PDF...</div>}
        {error && <div className="text-center text-destructive">{error}</div>}
        {/* Controls */}
        {!loading && !error && pages.length > 0 && (
          <div className="reader-controls flex flex-col items-center space-y-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={prevPage}
                disabled={currentPage <= 0}
                variant="outline"
                className={isMobile ? "mobile-nav-button" : ""}
              >
                Previous
              </Button>
              <Button 
                onClick={nextPage}
                disabled={currentPage >= totalPages - 1}
                variant="outline"
                className={isMobile ? "mobile-nav-button" : ""}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && pages.length > 0 && (
          <>
            {/* Conditional rendering based on screen size */}
            {isMobile ? (
              /* Mobile: Single Page View */
              <div className="mobile-page-container">
                <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                  <img
                    src={pages[currentPage]?.toDataURL("image/png") || "/placeholder.svg"}
                    alt={`Page ${currentPage + 1}`}
                    className="w-full h-auto object-contain"
                    crossOrigin="anonymous"
                  />
                </div>
                
                {/* Mobile navigation hint */}
                <div className="text-center text-xs text-muted-foreground mt-4">
                  Use Previous/Next buttons to navigate • Tap to zoom
                </div>
              </div>
            ) : (
              /* Desktop: Flip Book */
              <div className="flip-book-container">
                {pages.length > 0 && (
                  <HTMLFlipBook
                    key={bookKey}
                    width={400}
                    height={600}
                    size="stretch"
                    minWidth={300}
                    maxWidth={800}
                    minHeight={400}
                    maxHeight={1200}
                    maxShadowOpacity={0.5}
                    showCover={true}
                    mobileScrollSupport={true}
                    onFlip={onFlip}
                    className="demo-book"
                    ref={flipBookRef}
                    flippingTime={1000}
                    usePortrait={false}
                    startZIndex={0}
                    autoSize={true}
                    drawShadow={true}
                  >
                    {pages.map((canvas, index) => (
                      <div 
                        key={index}
                        className="page-content" 
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          backgroundColor: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}
                      >
                        <img
                          src={canvas.toDataURL("image/png")}
                          alt={`Page ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                          }}
                          crossOrigin="anonymous"
                        />
                      </div>
                    ))}
                  </HTMLFlipBook>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
