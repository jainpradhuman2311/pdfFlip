"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"

const DocViewer = dynamic(() => import("@cyntler/react-doc-viewer").then(m => m.default), { ssr: false })

// Utility function to convert Google Drive URLs to embeddable format
function convertGoogleDriveUrl(url: string): string {
  // Check if it's already a Google Drive URL
  if (url.includes('drive.google.com')) {
    // Extract file ID from various Google Drive URL formats
    let fileId = ''
    
    // Format: https://drive.google.com/file/d/{fileId}/view
    const viewMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
    if (viewMatch) {
      fileId = viewMatch[1]
    }
    
    // Format: https://drive.google.com/open?id={fileId}
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/)
    if (openMatch) {
      fileId = openMatch[1]
    }
    
    if (fileId) {
      // Return embeddable Google Drive URL
      return `https://drive.google.com/file/d/${fileId}/preview`
    }
  }
  
  // If not a Google Drive URL or can't extract ID, return original URL
  return url
}

interface UniversalViewerProps {
  fileUrl: string
  title: string
  mimeType: string
}

export function UniversalViewer({ fileUrl, title, mimeType }: UniversalViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isContentReady, setIsContentReady] = useState(false)
  const [isPdfFrameLoaded, setIsPdfFrameLoaded] = useState(false)
  const prefetchRef = useRef<HTMLLinkElement | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setLoadError(false)
    setLoadProgress(0)
    setIsContentReady(false)
    setIsPdfFrameLoaded(false)
    
    // Prefetch for faster loading
    const isPDFType = mimeType === 'application/pdf'
    if (isPDFType) {
      // For PDFs, use Google Drive URL conversion
      const prefetchUrl = convertGoogleDriveUrl(fileUrl)
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = prefetchUrl
      link.as = 'document'
      document.head.appendChild(link)
      prefetchRef.current = link
    } else {
      // For other file types, prefetch the original URL (localhost API)
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = fileUrl
      document.head.appendChild(link)
      prefetchRef.current = link
    }
    
    // Progressive loading simulation
    const progressInterval = setInterval(() => {
      setLoadProgress(prev => {
        if (isPDFType) {
          // For PDFs, continue past 85% but slower
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + Math.random() * (prev >= 85 ? 5 : 15)
        } else {
          // For non-PDFs, stop at 85%
          if (prev >= 85) {
            clearInterval(progressInterval)
            return 85
          }
          return prev + Math.random() * 15
        }
      })
    }, 150)

    if (!isPDFType) {
      // For non-PDFs, use the original timing
      const minLoadTimer = setTimeout(() => {
        setLoadProgress(100)
        setTimeout(() => {
          setIsLoading(false)
          setIsContentReady(true)
        }, 300)
      }, 600)
      
      return () => {
        clearInterval(progressInterval)
        clearTimeout(minLoadTimer)
      }
    } else {
      // For PDFs, add a backup timer to prevent getting stuck
      const pdfBackupTimer = setTimeout(() => {
        console.log('PDF backup timer: completing progress')
        setLoadProgress(100)
        setTimeout(() => {
          setIsLoading(false)
          setIsContentReady(true)
        }, 200)
      }, 3000) // 3 second backup for PDFs
      
      return () => {
        clearInterval(progressInterval)
        clearTimeout(pdfBackupTimer)
        // Cleanup prefetch link
        if (prefetchRef.current && document.head.contains(prefetchRef.current)) {
          document.head.removeChild(prefetchRef.current)
        }
      }
    }
  }, [fileUrl, mimeType])

  const isImage = mimeType?.startsWith('image/')
  const isPDF = mimeType === 'application/pdf'
  const isDocx = mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType === 'application/msword'
  const isPowerPoint = mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || mimeType === 'application/vnd.ms-powerpoint'
  const isExcel = mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || mimeType === 'application/vnd.ms-excel'

  // Handler for PDF load - moved to top level before any returns
  const handlePdfLoad = () => {
    setIsPdfFrameLoaded(true)
    setLoadProgress(100)
    
    // Much shorter delay - PDF iframe signals readiness
    setTimeout(() => {
      setIsLoading(false)
      setIsContentReady(true)
    }, 100)
  }

  // ALL useEffect hooks must be here, before any early returns
  // Fallback timer for PDFs
  useEffect(() => {
    if (isPDF && isLoading) {
      const fallbackTimer = setTimeout(() => {
        console.log('PDF ultimate fallback: forcing content display')
        setLoadProgress(100)
        setIsLoading(false)
        setIsContentReady(true)
      }, 4000)

      return () => clearTimeout(fallbackTimer)
    }
  }, [isPDF, isLoading])

  // Timer for DocViewer
  useEffect(() => {
    if (!isPDF && !isImage && isLoading) {
      const docTimer = setTimeout(() => {
        setIsContentReady(true)
      }, 1500)
      
      return () => clearTimeout(docTimer)
    }
  }, [isPDF, isImage, isLoading])

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ height: '85vh' }}>
        <div className="flex flex-col items-center gap-6">
          {/* Animated loader with progress */}
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full">
              <div 
                className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full transition-all duration-300"
                style={{ 
                  transform: `rotate(${loadProgress * 3.6}deg)`,
                  borderTopWidth: loadProgress > 90 ? '6px' : '4px'
                }}
              ></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {Math.round(loadProgress)}%
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            ></div>
          </div>
          
          {/* Loading text */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Loading Document
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isImage && "Preparing image viewer..."}
              {isPDF && "Loading PDF viewer..."}
              {isDocx && "Loading Word document..."}
              {isPowerPoint && "Loading PowerPoint presentation..."}
              {isExcel && "Loading Excel spreadsheet..."}
              {!isImage && !isPDF && !isDocx && !isPowerPoint && !isExcel && "Loading document..."}
            </p>
          </div>
          
          {/* File info */}
          <div className="text-center bg-slate-50 dark:bg-slate-800 rounded-lg p-4 max-w-md">
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
              {title}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {isImage && (
                  <>
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">Image</span>
                  </>
                )}
                {isPDF && (
                  <>
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">PDF</span>
                  </>
                )}
                {isDocx && (
                  <>
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Word</span>
                  </>
                )}
                {isPowerPoint && (
                  <>
                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium text-orange-600 dark:text-orange-400">PowerPoint</span>
                  </>
                )}
                {isExcel && (
                  <>
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Excel</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ height: '85vh' }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Unable to Load Document</h3>
          <p className="text-sm text-muted-foreground mb-4">
            There was an error loading this document. Please try again.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Image viewer with optimizations
  if (isImage) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8" style={{ height: '85vh' }}>
        <div className="max-w-full max-h-full relative">
          {/* Skeleton loader while image loads */}
          {!isContentReady && (
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          {/* Optimized image with lazy loading */}
          <img 
            src={fileUrl} 
            alt={title} 
            className={`max-w-full max-h-full object-contain rounded-xl shadow-lg ring-1 ring-slate-200/50 dark:ring-slate-700/50 transition-opacity duration-500 ${
              isContentReady ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ maxHeight: '80vh' }}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsContentReady(true)}
            onError={() => setLoadError(true)}
            // Add size hints for better performance
            sizes="(max-width: 768px) 100vw, 85vw"
          />
        </div>
      </div>
    )
  }

  // PDF viewer with streaming optimization
  if (isPDF) {
    // Convert the URL to Google Drive embeddable format (only for PDFs)
    const embeddableUrl = convertGoogleDriveUrl(fileUrl)
    
    return (
      <div className="w-full h-full relative">
        {/* Enhanced PDF loading state */}
        {(isLoading || !isContentReady) && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-60 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse flex items-center justify-center border-2 border-slate-300 dark:border-slate-600">
                <svg className="w-16 h-16 text-slate-400 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {isPdfFrameLoaded ? 'Rendering PDF...' : 'Loading from Google Drive...'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {Math.round(loadProgress)}% complete
                </p>
              </div>
              
              {/* Progress indicator */}
              <div className="w-48 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${loadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        {/* PDF iframe - now uses Google Drive directly */}
        <div className="w-full h-full" style={{ height: '85vh' }}>
          <iframe
            src={embeddableUrl}
            className="w-full h-full border-0"
            title={title}
            style={{ 
              borderRadius: '0.75rem',
              opacity: isContentReady ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
            onLoad={handlePdfLoad}
            onError={() => {
              console.log('PDF iframe error')
              setLoadError(true)
            }}
            // Ensure iframe loads quickly
            loading="eager"
            allow="autoplay"
            // Add additional load detection
            ref={(iframe) => {
              if (iframe) {
                // Backup load detection
                iframe.addEventListener('load', () => {
                  console.log('PDF iframe loaded via addEventListener')
                  handlePdfLoad()
                })
              }
            }}
          />
        </div>
      </div>
    )
  }

  // DocViewer for Office documents (DOCX, PPT, Excel, etc.)
  return (
    <div className="w-full h-full relative">
      {/* Document skeleton loader */}
      {!isContentReady && (
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="grid grid-cols-1 gap-2 w-64">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              ))}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isDocx && "Rendering Word document..."}
              {isPowerPoint && "Rendering PowerPoint..."}
              {isExcel && "Rendering Excel sheet..."}
              {!isDocx && !isPowerPoint && !isExcel && "Rendering document..."}
            </p>
          </div>
        </div>
      )}
      
      <div 
        className={`w-full h-full transition-opacity duration-500 ${
          isContentReady ? 'opacity-100' : 'opacity-0'
        }`} 
        style={{ height: '85vh' }}
      >
        <DocViewer 
          documents={[{ uri: fileUrl }]} 
          theme={{ 
            primary: "#1e293b", 
            secondary: "#f8fafc",
            tertiary: "#64748b",
            textPrimary: "#0f172a",
            textSecondary: "#475569"
          }} 
          style={{ 
            height: "100%", 
            width: "100%",
            borderRadius: "0.75rem"
          }}
          config={{
            header: {
              disableHeader: false,
              disableFileName: false,
              retainURLParams: false
            },
            csvDelimiter: ",",
            pdfZoom: {
              defaultZoom: 1.0,
              zoomJump: 0.1
            },
            pdfVerticalScrollByDefault: true,
            loadingRenderer: {
              showLoadingTimeout: false
            }
          }}
        />
      </div>
    </div>
  )
}
