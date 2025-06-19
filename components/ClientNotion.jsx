// components/ClientNotion.tsx
'use client'
import { NotionRenderer } from 'react-notion-x'
import 'react-notion-x/src/styles.css'

export function ClientNotion({ recordMap, fullPage = false, darkMode = false }) {
  return (
    <div className="notion-renderer-wrapper">
      <style jsx global>{`
        /* Custom typography overrides for Notion content */
        .notion-page {
          background: transparent !important;
          color: white !important;
        }
        
        .notion-text {
          color: rgb(229, 231, 235) !important; /* zinc-200 */
        }
        
        .notion-h1, .notion-h2, .notion-h3 {
          color: white !important;
          font-weight: 700 !important;
        }
        
        .notion-h1 {
          font-size: 2rem !important;
          margin: 2rem 0 1rem 0 !important;
        }
        
        .notion-h2 {
          font-size: 1.5rem !important;
          margin: 1.5rem 0 0.75rem 0 !important;
        }
        
        .notion-h3 {
          font-size: 1.25rem !important;
          margin: 1.25rem 0 0.5rem 0 !important;
        }
        
        .notion-list {
          color: rgb(229, 231, 235) !important;
        }
        
        .notion-quote {
          background: rgb(39, 39, 42) !important; /* zinc-800 */
          border-left: 4px solid rgb(75, 85, 99) !important; /* zinc-600 */
          color: rgb(229, 231, 235) !important;
          padding: 1rem !important;
          margin: 1rem 0 !important;
        }
        
        .notion-code {
          background: rgb(39, 39, 42) !important; /* zinc-800 */
          color: rgb(34, 197, 94) !important; /* green-500 */
          padding: 0.25rem 0.5rem !important;
          border-radius: 0.25rem !important;
        }
        
        .notion-callout {
          background: rgb(39, 39, 42) !important; /* zinc-800 */
          border: 1px solid rgb(63, 63, 70) !important; /* zinc-700 */
          color: rgb(229, 231, 235) !important;
        }

        /* Link styling */
        .notion-link {
          color: rgb(96, 165, 250) !important; /* blue-400 */
          text-decoration: underline !important;
        }
        
        .notion-link:hover {
          color: rgb(147, 197, 253) !important; /* blue-300 */
        }
        
        /* Better paragraph spacing */
        .notion-text p {
          margin: 0.75rem 0 !important;
          line-height: 1.7 !important;
        }
      `}</style>
      
      <NotionRenderer 
        recordMap={recordMap} 
        fullPage={false} 
        darkMode={true}
        className="notion-content"
      />
    </div>
  )
}
