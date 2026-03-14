import { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { PublicHeader } from "./PublicHeader";
import { GovFooter } from "./GovFooter";

interface PolicyLayoutProps {
  children: ReactNode;
  title: string;
}

export function PolicyLayout({ children, title }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicHeader />
      
      <main className="flex-1">
        <div className="bg-gradient-to-r from-[#2a7f3e] to-[#1a5a2d] py-8">
          <div className="max-w-5xl mx-auto px-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <p className="text-white/80 mt-2 text-sm">
              Ministry of Environment, Forest and Climate Change
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            {children}
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  );
}
