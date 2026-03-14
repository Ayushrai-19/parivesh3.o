import { Link } from "react-router";
import { GovHeader } from "../components/GovHeader";
import { GovFooter } from "../components/GovFooter";
import { RoleExplainer } from "../components/RoleExplainer";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { FileText, CheckCircle, Clock, Shield, Zap, Users, ArrowRight, Upload, Search, Award, Megaphone, Calendar, Map, Eye, FileCheck, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import logoImage from "figma:asset/04582d5cbcbafd55748615841a24afdf6cfa7d0a.png";
import clearanceTypesImage from "figma:asset/3b0ba4ab2b721677efc1d30d566e5d4b296fcd96.png";
import crzImage from "figma:asset/dba8302ded76340fabfac4c048a0418aa25e1e44.png";
import image_8c08243ee5c9d81b83557e1a298a8febe227bcb6 from "figma:asset/8c08243ee5c9d81b83557e1a298a8febe227bcb6.png";
import image_34d74e694ae170564b7b290c87e99be66dc55b6c from "figma:asset/34d74e694ae170564b7b290c87e99be66dc55b6c.png";
import image_884f3f0bc3bcf48cfb8cdac043a050b3c0271c70 from "figma:asset/884f3f0bc3bcf48cfb8cdac043a050b3c0271c70.png";
import govLogosSlider1 from "figma:asset/cdd8a4ae7309b4b6f0afafc030672859fc2514c6.png";
import govLogosSlider2 from "figma:asset/d2fe6e7ee5edf11a501ed427998fcfcc15304841.png";
import heroSlide1 from "figma:asset/1037382144b014d8c4ba67a407c1191bbf4497c5.png";
import heroSlide2 from "figma:asset/ff024813feeb7019cd4ecb38f18414fe5c97c4a8.png";
import heroSlide3 from "figma:asset/3e9e08699ce48d5732a87c1cbbffb81945156f11.png";
import fernBackground from "figma:asset/e9452bc2977a09f88f68aeedf4b997b44f62e982.png";

const statsData = [
  { name: "Approved", value: 1245, color: "#10b981" },
  { name: "Under Review", value: 486, color: "#0ea5e9" },
  { name: "Pending", value: 234, color: "#f59e0b" },
];

const monthlyData = [
  { month: "Jan", applications: 65 },
  { month: "Feb", applications: 72 },
  { month: "Mar", applications: 85 },
  { month: "Apr", applications: 78 },
  { month: "May", applications: 92 },
  { month: "Jun", applications: 88 },
];

export function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [heroSlide1, heroSlide2, heroSlide3];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <GovHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-6 min-h-[50vh] flex items-center">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105"
          >
            <source src="https://parivesh.nic.in/assests/img/homevideo.mp4" type="video/mp4" />
          </video>
          {/* Subtle dark overlay for readability - 35% opacity */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/35 via-black/30 to-black/35"></div>
          {/* Subtle gradient for text area */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/15"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto">
            {/* National Flag Colors Indicator */}
            <div className="flex items-center justify-center gap-1 mb-4">
              <div className="w-20 h-1 bg-orange-500 rounded shadow-lg"></div>
              <div className="w-20 h-1 bg-white border border-white/50 rounded shadow-lg"></div>
              <div className="w-20 h-1 bg-green-600 rounded shadow-lg"></div>
            </div>

            {/* Light Glassmorphism Content Container - 10% Opacity */}
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-5 md:p-8 shadow-2xl">
              {/* Government Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/95 backdrop-blur-sm border-2 border-green-600 rounded-full shadow-lg mb-4">
                <span className="flex items-center justify-center w-6 h-6 bg-green-600 rounded-full">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                </span>
                <span className="text-sm font-bold text-green-800">Certified by Government of India</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="font-black mb-2.5 text-white leading-tight text-[42px] md:text-[50px] drop-shadow-2xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.4)' }}>
                PARIVESH 3.0
              </h1>
              
              {/* Flag Divider */}
              <div className="h-1.5 w-36 bg-gradient-to-r from-orange-500 via-white to-green-600 mx-auto mb-3.5 rounded-full shadow-lg"></div>
              
              {/* Subtitle */}
              <h2 className="font-bold text-white mb-3.5 text-[16px] md:text-[18px] drop-shadow-xl" style={{ textShadow: '0 3px 15px rgba(0,0,0,0.5), 0 1px 6px rgba(0,0,0,0.4)' }}>
                Pro-Active and Responsive facilitation by Interactive, Virtuous and Environmental Single-window Hub
              </h2>
              
              {/* Description Card */}
              <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm border-l-4 border-orange-500 pl-5 pr-5 py-3 rounded-r-2xl shadow-xl mb-6">
                <p className="text-base md:text-lg text-gray-900 font-semibold">
                  Single Window Integrated Environmental Management System for Environmental Clearances
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
                <Link
                  to="/application/new"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-sky-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all shadow-lg"
                >
                  Register Application
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/95 backdrop-blur-sm text-gray-900 rounded-xl font-semibold border-2 border-white/60 hover:border-green-500 hover:shadow-xl transition-all shadow-lg"
                >
                  Login to Dashboard
                </Link>
              </div>

              {/* Stats Cards with Light Glassmorphism */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                <div className="backdrop-blur-sm bg-white/15 border border-white/30 rounded-2xl p-3 hover:bg-white/25 transition-all">
                  <div className="text-3xl font-black text-white mb-1 drop-shadow-xl" style={{ textShadow: '0 3px 15px rgba(0,0,0,0.6)' }}>1,245</div>
                  <div className="text-sm font-semibold text-white drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Applications Approved</div>
                </div>
                <div className="backdrop-blur-sm bg-white/15 border border-white/30 rounded-2xl p-3 hover:bg-white/25 transition-all">
                  <div className="text-3xl font-black text-white mb-1 drop-shadow-xl" style={{ textShadow: '0 3px 15px rgba(0,0,0,0.6)' }}>486</div>
                  <div className="text-sm font-semibold text-white drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Under Review</div>
                </div>
                <div className="backdrop-blur-sm bg-white/15 border border-white/30 rounded-2xl p-3 hover:bg-white/25 transition-all">
                  <div className="text-3xl font-black text-white mb-1 drop-shadow-xl" style={{ textShadow: '0 3px 15px rgba(0,0,0,0.6)' }}>45</div>
                  <div className="text-sm font-semibold text-white drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Days Avg Processing</div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-white/60">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-gray-900">Secure & Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-white/60">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-gray-900">MoEFCC Certified</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-white/60">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-semibold text-gray-900">Fast Processing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Large Action Cards */}
      

      {/* Role Explainer */}
      <RoleExplainer />

      {/* Recent Announcements */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={fernBackground}
            alt="Environmental Background"
            className="w-full h-full object-cover"
          />
          {/* White overlay for readability */}
          <div className="absolute inset-0 bg-white/85"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header on top */}
          <div className="text-center mb-12">
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Announcements</h2>
            <p className="text-lg text-gray-600 mb-8">Stay updated with the latest circulars and notifications</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            {/* Left Section - 50% Hero Carousel */}
            <div className="flex-1">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={heroSlides[currentSlide]}
                    alt={`Slide ${currentSlide + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  />
                </AnimatePresence>
                
                {/* Slide Indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentSlide === index
                          ? "bg-white w-8"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg z-10"
                  aria-label="Previous slide"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg z-10"
                  aria-label="Next slide"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Section - 50% with Auto Scrolling Announcements */}
            <div className="flex-1 relative overflow-hidden h-[400px] rounded-2xl border-2 border-gray-200 bg-white shadow-lg">
              <style>{`
                @keyframes scroll-up {
                  0% {
                    transform: translateY(0);
                  }
                  100% {
                    transform: translateY(-50%);
                  }
                }
                .scroll-container {
                  animation: scroll-up 30s linear infinite;
                }
                .scroll-container:hover {
                  animation-play-state: paused;
                }
              `}</style>
              
              <div className="scroll-container">
                {/* First set of announcements */}
                {[
                  {
                    date: "March 10, 2026",
                    title: "Updated EIA Notification 2026",
                    description: "Revised environmental impact assessment procedures for infrastructure projects.",
                    type: "Circular",
                    priority: "High",
                    color: "from-red-500 to-pink-500"
                  },
                  {
                    date: "March 5, 2026",
                    title: "New CRZ Guidelines Released",
                    description: "Updated coastal regulation zone management guidelines effective immediately.",
                    type: "Notification",
                    priority: "Medium",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    date: "February 28, 2026",
                    title: "PARIVESH 3.0 System Maintenance",
                    description: "Scheduled maintenance on March 15, 2026 from 2:00 AM to 6:00 AM IST.",
                    type: "Advisory",
                    priority: "Low",
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    date: "February 20, 2026",
                    title: "Forest Clearance Process Update",
                    description: "New guidelines for forest clearance applications and documentation requirements.",
                    type: "Circular",
                    priority: "High",
                    color: "from-emerald-500 to-green-500"
                  },
                  {
                    date: "February 15, 2026",
                    title: "Wildlife Protection Guidelines",
                    description: "Enhanced measures for wildlife protection in project areas.",
                    type: "Notification",
                    priority: "Medium",
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    date: "February 10, 2026",
                    title: "Public Consultation Framework",
                    description: "Updated framework for conducting public consultations and hearings.",
                    type: "Advisory",
                    priority: "Medium",
                    color: "from-cyan-500 to-blue-500"
                  }
                ].map((announcement, index) => (
                  <div key={`first-${index}`} className="border-b-2 border-gray-100 hover:bg-blue-50 transition-all">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 bg-gradient-to-r ${announcement.color} text-white rounded-full text-xs font-semibold`}>
                          {announcement.type}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {announcement.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{announcement.description}</p>
                      <button className="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Duplicate set for seamless loop */}
                {[
                  {
                    date: "March 10, 2026",
                    title: "Updated EIA Notification 2026",
                    description: "Revised environmental impact assessment procedures for infrastructure projects.",
                    type: "Circular",
                    priority: "High",
                    color: "from-red-500 to-pink-500"
                  },
                  {
                    date: "March 5, 2026",
                    title: "New CRZ Guidelines Released",
                    description: "Updated coastal regulation zone management guidelines effective immediately.",
                    type: "Notification",
                    priority: "Medium",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    date: "February 28, 2026",
                    title: "PARIVESH 3.0 System Maintenance",
                    description: "Scheduled maintenance on March 15, 2026 from 2:00 AM to 6:00 AM IST.",
                    type: "Advisory",
                    priority: "Low",
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    date: "February 20, 2026",
                    title: "Forest Clearance Process Update",
                    description: "New guidelines for forest clearance applications and documentation requirements.",
                    type: "Circular",
                    priority: "High",
                    color: "from-emerald-500 to-green-500"
                  },
                  {
                    date: "February 15, 2026",
                    title: "Wildlife Protection Guidelines",
                    description: "Enhanced measures for wildlife protection in project areas.",
                    type: "Notification",
                    priority: "Medium",
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    date: "February 10, 2026",
                    title: "Public Consultation Framework",
                    description: "Updated framework for conducting public consultations and hearings.",
                    type: "Advisory",
                    priority: "Medium",
                    color: "from-cyan-500 to-blue-500"
                  }
                ].map((announcement, index) => (
                  <div key={`second-${index}`} className="border-b-2 border-gray-100 hover:bg-blue-50 transition-all">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 bg-gradient-to-r ${announcement.color} text-white rounded-full text-xs font-semibold`}>
                          {announcement.type}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {announcement.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{announcement.description}</p>
                      <button className="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="inline-flex items-center justify-center bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors px-8 py-3">
              View All Announcements
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple, transparent, and efficient clearance process</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Upload, title: "Submit Application", desc: "Upload your project details and required documents", color: "from-green-500 to-emerald-600" },
              { icon: Search, title: "Scrutiny Review", desc: "Expert team reviews your application thoroughly", color: "from-blue-500 to-cyan-600" },
              { icon: FileText, title: "Meeting Review", desc: "Committee evaluates and provides recommendations", color: "from-purple-500 to-pink-600" },
              { icon: Award, title: "Get Clearance", desc: "Receive your environmental clearance certificate", color: "from-orange-500 to-red-600" },
            ].map((step, index) => (
              <div key={index} className="relative p-[0px]">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 hover:border-green-500 transition-all hover:shadow-xl group px-[32px] py-[36px]">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-full border-4 border-green-500 flex items-center justify-center font-bold text-green-600 shadow-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clearance Types */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Animated Green Gradient Background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, #10b981 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, #059669 0%, transparent 50%)",
              "radial-gradient(circle at 0% 100%, #10b981 0%, transparent 50%)",
              "radial-gradient(circle at 100% 0%, #059669 0%, transparent 50%)",
              "radial-gradient(circle at 0% 0%, #10b981 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-green-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floating Leaf Icons */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`leaf-${i}`}
            className="absolute text-green-500/20"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          >
            <Leaf className="w-6 h-6" />
          </motion.div>
        ))}

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-100 border-2 border-green-600 rounded-full shadow-md mb-6">
              <span className="flex items-center justify-center w-6 h-6 bg-green-600 rounded-full">
                <CheckCircle className="w-4 h-4 text-white" />
              </span>
              <span className="text-sm font-bold text-green-800">4 Types of Clearances</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Green Clearances</h2>
            <p className="text-lg text-gray-600">PARIVESH facilitates multiple types of environmental clearances under one platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Environment Clearance */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="group"
            >
              <Link
                to="/clearance/environment"
                className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-blue-500 hover:shadow-2xl transition-all"
              >
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <img
                    src={image_884f3f0bc3bcf48cfb8cdac043a050b3c0271c70}
                    alt="Environment Clearance"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  <div className="absolute bottom-4 left-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-10 h-10" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="30" fill="#3B82F6" opacity="0.2"/>
                        <path d="M32 12C25.4 12 20 17.4 20 24C20 30.6 25.4 36 32 36C38.6 36 44 30.6 44 24C44 17.4 38.6 12 32 12ZM32 44C24 44 16 48 16 52V54H48V52C48 48 40 44 32 44Z" fill="#3B82F6"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">ENVIRONMENT CLEARANCE</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">EC clearance for industrial and infrastructure projects under EIA Notification</p>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mt-auto">
                    Apply Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Forest Clearance */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group"
            >
              <Link
                to="/clearance/forest"
                className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-green-600 hover:shadow-2xl transition-all"
              >
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <img
                    src={image_34d74e694ae170564b7b290c87e99be66dc55b6c}
                    alt="Forest Clearance"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{ objectPosition: '33% center' }}
                  />
                  
                  <div className="absolute bottom-4 left-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-10 h-10" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="30" fill="#059669" opacity="0.2"/>
                        <path d="M32 12C28 12 24 16 24 20C24 24 28 28 32 28C36 28 40 24 40 20C40 16 36 12 32 12ZM20 24C18 24 16 26 16 28C16 30 18 32 20 32C22 32 24 30 24 28C24 26 22 24 20 24ZM44 24C42 24 40 26 40 28C40 30 42 32 44 32C46 32 48 30 48 28C48 26 46 24 44 24ZM32 28C28 28 20 30 20 34V52H44V34C44 30 36 28 32 28Z" fill="#059669"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">FOREST CLEARANCE</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">FC clearance for diversion of forest land under Forest Conservation Act</p>
                  <div className="flex items-center gap-2 text-green-600 font-semibold text-sm mt-auto">
                    Apply Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Wildlife Clearance */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group"
            >
              <Link
                to="/clearance/wildlife"
                className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-orange-500 hover:shadow-2xl transition-all"
              >
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <img
                    src={image_8c08243ee5c9d81b83557e1a298a8febe227bcb6}
                    alt="Wildlife Clearance"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  <div className="absolute bottom-4 left-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-10 h-10" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="30" fill="#F97316" opacity="0.2"/>
                        <path d="M24 20C22 20 20 22 20 24C20 26 22 28 24 28C26 28 28 26 28 24C28 22 26 20 24 20ZM40 20C38 20 36 22 36 24C36 26 38 28 40 28C42 28 44 26 44 24C44 22 42 20 40 20ZM32 24C29 24 26 26 26 28V32H38V28C38 26 35 24 32 24ZM28 34V42C28 44 30 46 32 46C34 46 36 44 36 42V34H28Z" fill="#F97316"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">WILDLIFE CLEARANCE</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">WL clearance for projects affecting wildlife habitats and protected areas</p>
                  <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm mt-auto">
                    Apply Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* CRZ Clearance */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group"
            >
              <Link
                to="/clearance/crz"
                className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-cyan-500 hover:shadow-2xl transition-all"
              >
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <img
                    src={crzImage}
                    alt="CRZ Clearance"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-10 h-10" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="30" fill="#06B6D4" opacity="0.2"/>
                        <path d="M16 32C16 32 20 24 32 24C44 24 48 32 48 32C48 32 44 40 32 40C20 40 16 32 16 32ZM32 28C28.7 28 26 30.7 26 34C26 37.3 28.7 40 32 40C35.3 40 38 37.3 38 34C38 30.7 35.3 28 32 28ZM32 30C34.2 30 36 31.8 36 34C36 36.2 34.2 38 32 38C29.8 38 28 36.2 28 34C28 31.8 29.8 30 32 30Z" fill="#06B6D4"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-500 transition-colors">CRZ CLEARANCE</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">Coastal Regulation Zone clearance for projects in coastal areas and zones</p>
                  <div className="flex items-center gap-2 text-cyan-500 font-semibold text-sm mt-auto">
                    Apply Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Info Banner */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border-2 border-blue-200">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Need help choosing the right clearance?</h3>
                <p className="text-gray-600">Our expert team is available to guide you through the clearance process and help you select the appropriate clearance type for your project.</p>
              </div>
              <Link
                to="/contact"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                Contact Support
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-lg text-gray-600">Everything you need for seamless environmental clearance</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Fast Processing",
                desc: "Automated workflows reduce clearance time to an average of 45 days",
                gradient: "from-yellow-400 to-orange-500",
                bgGradient: "from-yellow-50 to-orange-50"
              },
              {
                icon: Shield,
                title: "Secure & Compliant",
                desc: "Bank-grade security with complete regulatory compliance",
                gradient: "from-blue-400 to-purple-500",
                bgGradient: "from-blue-50 to-purple-50"
              },
              {
                icon: Users,
                title: "Multi-Role Access",
                desc: "Separate dashboards for proponents, scrutiny teams, and administrators",
                gradient: "from-green-400 to-teal-500",
                bgGradient: "from-green-50 to-teal-50"
              },
              {
                icon: FileText,
                title: "Document Management",
                desc: "Centralized storage and tracking for all application documents",
                gradient: "from-pink-400 to-rose-500",
                bgGradient: "from-pink-50 to-rose-50"
              },
              {
                icon: CheckCircle,
                title: "Real-time Tracking",
                desc: "Monitor application status at every step of the workflow",
                gradient: "from-cyan-400 to-blue-500",
                bgGradient: "from-cyan-50 to-blue-50"
              },
              {
                icon: Clock,
                title: "Automated Notifications",
                desc: "Get instant alerts for status updates and required actions",
                gradient: "from-purple-400 to-indigo-500",
                bgGradient: "from-purple-50 to-indigo-50"
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className={`bg-gradient-to-br ${feature.bgGradient} rounded-2xl p-8 border border-white shadow-lg hover:shadow-2xl transition-all group`}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-700">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Dashboard Preview */}
      

      {/* Government Credibility */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-6">Trusted by Government of India</h2>
            <p className="text-xl text-gray-300 mb-8">
              PARIVESH 3.0 is an official platform by the Ministry of Environment, Forest and Climate Change, 
              ensuring complete transparency and regulatory compliance in environmental clearance processes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <div className="text-sm">Ministry of Environment</div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="text-sm">Forest & Climate Change</div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="text-sm">Government of India</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of organizations using PARIVESH 3.0 for faster, more transparent environmental clearances.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-sky-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/guidelines"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-green-500 transition-all"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Government Partners Slider */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Integrated Government Services</h2>
            <p className="text-lg text-gray-600">Seamlessly connected with major government platforms and ministries</p>
          </div>
        </div>

        {/* First Slider - Government Platforms */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          <motion.div
            className="flex gap-12"
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate the image 4 times for seamless loop */}
            {[1, 2, 3, 4].map((i) => (
              <div key={`gov-slider-1-${i}`} className="flex-shrink-0">
                <img
                  src={govLogosSlider1}
                  alt="Government Platforms"
                  className="h-20 w-auto"
                  style={{ minWidth: '1000px' }}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second Slider - Ministries (Reverse Direction) */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
          
          <motion.div
            className="flex gap-12"
            animate={{
              x: [-1920, 0],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate the image 4 times for seamless loop */}
            {[1, 2, 3, 4].map((i) => (
              <div key={`gov-slider-2-${i}`} className="flex-shrink-0">
                <img
                  src={govLogosSlider2}
                  alt="Government Ministries"
                  className="h-20 w-auto"
                  style={{ minWidth: '1000px' }}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <GovFooter />
    </div>
  );
}