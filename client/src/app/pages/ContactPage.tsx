import { useState } from "react";
import { GovHeader } from "../components/GovHeader";
import { GovFooter } from "../components/GovFooter";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  User, 
  Building2, 
  FileText, 
  MessageSquare, 
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Globe,
  Headphones,
  Video,
  Calendar,
  ExternalLink,
  Twitter,
  Facebook,
  Linkedin,
  Youtube
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  subject: string;
  category: string;
  applicationId: string;
  message: string;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    question: "How long does the environmental clearance process take?",
    answer: "The typical timeline is 105-120 days from the date of complete submission. However, this may vary based on project category, completeness of documentation, and requirement for public consultation.",
    category: "Process"
  },
  {
    question: "What documents are required for EC application?",
    answer: "Required documents include Project Report, Form-1, EIA/EMP Report, Public Hearing proceedings, land documents, NOCs from relevant authorities, and corporate environmental responsibility plan. Specific requirements vary by project type.",
    category: "Documentation"
  },
  {
    question: "How can I track my application status?",
    answer: "You can track your application using the 'Track Application' feature on the PARIVESH portal. Enter your unique Application ID to view real-time status updates and timeline.",
    category: "Tracking"
  },
  {
    question: "What is the application processing fee?",
    answer: "Processing fees vary based on project cost and category. Category A projects: ₹5,00,000 - ₹15,00,000; Category B1: ₹2,00,000 - ₹5,00,000; Category B2: ₹50,000 - ₹2,00,000. Exact fees are calculated during application submission.",
    category: "Payment"
  },
  {
    question: "Can I modify my application after submission?",
    answer: "Minor modifications can be requested through the portal before scrutiny begins. Major changes require application withdrawal and fresh submission. Contact the scrutiny team for guidance.",
    category: "Process"
  },
  {
    question: "What happens if my application is rejected?",
    answer: "If rejected, you'll receive detailed reasons. You can address the concerns and reapply after 6 months, or appeal to the appellate authority within 60 days of the rejection decision.",
    category: "Process"
  },
  {
    question: "Is public hearing mandatory for all projects?",
    answer: "Public hearing is mandatory for Category A projects and Category B1 projects (except specific exemptions). Category B2 projects determined by SEAC/SEIAA may also require public hearing.",
    category: "Requirements"
  },
  {
    question: "How do I get forest clearance along with EC?",
    answer: "Forest clearance is applied separately through the same PARIVESH portal. Both clearances can be processed simultaneously. Ensure you submit the forest clearance application along with EC application.",
    category: "Process"
  }
];

const regionalOffices = [
  {
    region: "Northern Region",
    city: "New Delhi",
    address: "Indira Paryavaran Bhawan, Jor Bagh Road, New Delhi - 110003",
    phone: "+91-11-2061-6000",
    email: "parivesh.north@gov.in",
    states: "Delhi, Haryana, Punjab, Himachal Pradesh, Jammu & Kashmir, Ladakh, Uttarakhand",
    color: "from-blue-500 to-cyan-600"
  },
  {
    region: "Western Region",
    city: "Mumbai",
    address: "Greentech Tower, Bandra Kurla Complex, Mumbai - 400051",
    phone: "+91-22-2659-4000",
    email: "parivesh.west@gov.in",
    states: "Maharashtra, Gujarat, Rajasthan, Goa, Dadra & Nagar Haveli, Daman & Diu",
    color: "from-purple-500 to-pink-600"
  },
  {
    region: "Southern Region",
    city: "Bangalore",
    address: "Kendriya Sadan, Koramangala, Bangalore - 560034",
    phone: "+91-80-2553-4000",
    email: "parivesh.south@gov.in",
    states: "Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, Telangana, Puducherry",
    color: "from-green-500 to-emerald-600"
  },
  {
    region: "Eastern Region",
    city: "Kolkata",
    address: "Parivesh Bhawan, Salt Lake City, Kolkata - 700091",
    phone: "+91-33-2334-4000",
    email: "parivesh.east@gov.in",
    states: "West Bengal, Bihar, Jharkhand, Odisha, Andaman & Nicobar Islands",
    color: "from-orange-500 to-red-600"
  },
  {
    region: "North-Eastern Region",
    city: "Guwahati",
    address: "Environment Complex, Beltola, Guwahati - 781028",
    phone: "+91-361-2234-000",
    email: "parivesh.northeast@gov.in",
    states: "Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, Sikkim",
    color: "from-teal-500 to-blue-600"
  }
];

export function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    organization: "",
    subject: "",
    category: "",
    applicationId: "",
    message: ""
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      errors.phone = "Invalid phone number";
    }
    if (!formData.category) errors.category = "Category is required";
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate form submission
      console.log("Form submitted:", formData);
      setFormSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          organization: "",
          subject: "",
          category: "",
          applicationId: "",
          message: ""
        });
      }, 3000);
    }
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <GovHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M30 15 L32 21 L38 21 L33 25 L35 31 L30 27 L25 31 L27 25 L22 21 L28 21 Z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-1 mb-6">
              <div className="w-20 h-1 bg-orange-500 rounded"></div>
              <div className="w-20 h-1 bg-white border border-gray-300 rounded"></div>
              <div className="w-20 h-1 bg-green-600 rounded"></div>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-4 text-gray-900">
              Contact Us
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-orange-500 via-white to-green-600 mx-auto mb-4 rounded-full"></div>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We're here to help you with your environmental clearance journey
            </p>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl mx-auto mb-3">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div className="text-sm font-semibold text-gray-500 mb-1">Helpline</div>
                <div className="text-lg font-bold text-gray-900">1800-11-2345</div>
                <div className="text-xs text-gray-500 mt-1">Toll Free</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mx-auto mb-3">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div className="text-sm font-semibold text-gray-500 mb-1">Email</div>
                <div className="text-lg font-bold text-gray-900 truncate">support@parivesh.gov.in</div>
                <div className="text-xs text-gray-500 mt-1">24/7 Support</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mx-auto mb-3">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="text-sm font-semibold text-gray-500 mb-1">Office Hours</div>
                <div className="text-lg font-bold text-gray-900">9 AM - 6 PM</div>
                <div className="text-xs text-gray-500 mt-1">Mon - Fri</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl mx-auto mb-3">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div className="text-sm font-semibold text-gray-500 mb-1">Head Office</div>
                <div className="text-lg font-bold text-gray-900">New Delhi</div>
                <div className="text-xs text-gray-500 mt-1">5 Regional Offices</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                    <p className="text-gray-600">Fill out the form below and we'll get back to you soon</p>
                  </div>
                </div>

                {formSubmitted ? (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-600 mb-4">Thank you for contacting us. We'll respond within 24 hours.</p>
                    <p className="text-sm text-gray-500">Reference ID: MSG-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border-2 ${formErrors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-green-500 transition-colors`}
                            placeholder="Enter your name"
                          />
                        </div>
                        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border-2 ${formErrors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-green-500 transition-colors`}
                            placeholder="your.email@example.com"
                          />
                        </div>
                        {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border-2 ${formErrors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-green-500 transition-colors`}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Organization
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="organization"
                            value={formData.organization}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                            placeholder="Your organization name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 ${formErrors.category ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-green-500 transition-colors bg-white`}
                        >
                          <option value="">Select category</option>
                          <option value="application">Application Inquiry</option>
                          <option value="technical">Technical Support</option>
                          <option value="payment">Payment Issue</option>
                          <option value="document">Document Related</option>
                          <option value="status">Status Update</option>
                          <option value="general">General Query</option>
                          <option value="complaint">Complaint</option>
                          <option value="feedback">Feedback</option>
                        </select>
                        {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Application ID (if applicable)
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="applicationId"
                            value={formData.applicationId}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                            placeholder="EC/2026/XXX/12345"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 ${formErrors.subject ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-green-500 transition-colors`}
                        placeholder="Brief subject of your inquiry"
                      />
                      {formErrors.subject && <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className={`w-full px-4 py-3 border-2 ${formErrors.message ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-green-500 transition-colors resize-none`}
                        placeholder="Describe your inquiry or issue in detail..."
                      ></textarea>
                      {formErrors.message && <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              {/* Other Contact Methods */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-blue-600" />
                  Other Ways to Reach Us
                </h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Video Call Support</div>
                      <div className="text-xs text-gray-500">Schedule a video consultation</div>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-md transition-all text-left group">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Live Chat</div>
                      <div className="text-xs text-gray-500">Chat with our support team</div>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all text-left group">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Book Appointment</div>
                      <div className="text-xs text-gray-500">In-person or virtual meeting</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  Follow Us
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Twitter className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Twitter</span>
                  </button>
                  <button className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-700 hover:shadow-md transition-all">
                    <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                      <Facebook className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Facebook</span>
                  </button>
                  <button className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-600 hover:shadow-md transition-all">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Linkedin className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">LinkedIn</span>
                  </button>
                  <button className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-red-500 hover:shadow-md transition-all">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <Youtube className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">YouTube</span>
                  </button>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Emergency?</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  For urgent environmental violations or emergencies
                </p>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                  Call Emergency Hotline
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Offices */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Regional Offices</h2>
            <p className="text-lg text-gray-600">Visit our regional offices across India</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionalOffices.map((office, index) => (
              <div key={index} className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-2xl hover:border-green-500 transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${office.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{office.region}</h3>
                    <p className="text-sm text-gray-500">{office.city}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{office.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{office.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{office.email}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Coverage Area:</p>
                  <p className="text-xs text-gray-600">{office.states}</p>
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-xl font-semibold border border-gray-200 hover:border-green-500 hover:shadow-md transition-all flex items-center justify-center gap-2 group-hover:bg-gradient-to-r group-hover:from-green-50 group-hover:to-blue-50">
                  <ExternalLink className="w-4 h-4" />
                  Get Directions
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 ${expandedFAQ === index ? 'border-green-500 shadow-xl' : 'border-gray-200 shadow-md'} overflow-hidden transition-all`}>
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-xs font-semibold rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{faq.question}</h3>
                  </div>
                  <div className={`transform transition-transform ${expandedFAQ === index ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-6 h-6 text-gray-600" />
                  </div>
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Didn't find what you're looking for?</p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
              <MessageSquare className="w-5 h-5" />
              Ask a Question
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <GovFooter />
    </div>
  );
}