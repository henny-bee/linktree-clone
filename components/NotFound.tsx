import { Button } from "@/components/ui/button"
import { ArrowRight, Plus, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <div className="transition-all duration-1000 ease-out opacity-100 translate-y-0">
          <div className="relative mb-8">
            <h1 className="text-8xl md:text-9xl font-bold text-slate-200 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-16 h-16 text-slate-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="transition-all duration-1000 delay-300 ease-out opacity-100 translate-y-0">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist yet. Why not create something amazing?
          </p>
        </div>

        {/* Animated Button */}
        <div className="transition-all duration-1000 delay-500 ease-out opacity-100 translate-y-0">
          <a href="/">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Create Your Link Page
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </a>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-indigo-300 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping delay-1000"></div>
        </div>

        {/* Bottom Links */}
        <div className="mt-12 transition-all duration-1000 delay-700 ease-out opacity-100 translate-y-0">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <a href="/" className="hover:text-slate-700 transition-colors duration-200 hover:underline">
              Go Home
            </a>
            <a href="/explore" className="hover:text-slate-700 transition-colors duration-200 hover:underline">
              Browse Links
            </a>
            <a href="/support" className="hover:text-slate-700 transition-colors duration-200 hover:underline">
              Contact Support
            </a>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
    </div>
  )
}