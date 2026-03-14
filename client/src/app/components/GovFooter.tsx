import { Twitter, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router";

export function GovFooter() {
  return (
    <footer className="bg-[#2a7f3e] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8">
          {/* Left Section - Logo and Contact Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {/* PARIVESH Logo */}
              
              
              {/* Organization Info */}
              <div className="space-y-1 text-sm">
                <h3 className="text-lg font-semibold">परिवेश<br />PARIVESH</h3>
                <p className="text-xs text-white/80">(CPC GREEN)</p>
                <div className="pt-2 space-y-1 text-white/90">
                  <p className="font-medium">Ministry of Environment, Forest and Climate Change</p>
                  <p>India Paryavaran Bhawan</p>
                  <p>Jor Bagh Road, New Delhi - 110003</p>
                  <p>Toll Free Number : 1800 11 9792 (6 Lines)</p>
                  <p>
                    For any Technical support,{" "}
                    <Link to="/contact" className="underline hover:text-white">
                      click here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Social Media and QR Code */}
          <div className="flex flex-col items-end gap-6">
            {/* Social Media Links */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-right">Social Media</h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://snapchat.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center transition-colors"
                  aria-label="Snapchat"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3 0 .633-.091.934-.18.301-.09.633-.18.978-.18.39 0 .747.1 1.032.3.329.232.528.58.546.996.019.446-.169.9-.525 1.273-.225.232-.538.43-.853.628l-.079.05c-.361.23-.694.443-.904.727-.104.142-.157.3-.148.465.011.19.096.385.296.583.455.455 1.024.828 1.592 1.2.716.47 1.431.94 1.878 1.526.127.167.207.336.238.5.035.179.015.355-.063.515-.197.396-.611.615-1.204.615-.033 0-.068 0-.104-.003-.18-.011-.404-.042-.672-.084-.531-.082-1.191-.184-1.926-.045a.984.984 0 00-.35.148c-.48.38-.99.77-1.496 1.16-.653.502-1.306 1.003-1.962 1.396-.656.394-1.33.676-2.036.676-.709 0-1.38-.282-2.037-.676-.656-.393-1.308-.894-1.962-1.396-.505-.39-1.016-.78-1.496-1.16a.985.985 0 00-.35-.148c-.735-.139-1.395-.037-1.926.045-.268.042-.491.073-.672.084-.036.003-.07.003-.104.003-.593 0-1.007-.219-1.204-.615-.078-.16-.098-.336-.063-.515.031-.164.111-.333.238-.5.447-.586 1.162-1.056 1.878-1.526.568-.372 1.137-.745 1.592-1.2.2-.198.285-.394.296-.583.009-.165-.044-.323-.148-.465-.21-.284-.543-.497-.904-.727l-.079-.05c-.315-.198-.628-.396-.853-.628-.356-.373-.544-.827-.525-1.273.018-.416.217-.764.546-.996.285-.2.642-.3 1.032-.3.345 0 .677.09.978.18.301.089.634.18.934.18.198 0 .326-.045.401-.09a27.768 27.768 0 01-.03-.51l-.003-.06c-.104-1.628-.23-3.654.299-4.847C7.859 1.069 11.216.793 12.206.793z"/>
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* QR Code and Visitor Count */}
            <div className="flex items-start gap-4">
              {/* Visitor Counter */}
              <div className="border border-white/30 px-4 py-2 rounded text-center">
                <div className="text-xs text-white/70">Total Visitor</div>
                <div className="text-lg font-bold mt-1">3860797</div>
              </div>

              {/* QR Code */}
              
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="bg-[#236239] py-3">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/90">
            <Link to="/contact" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/40">|</span>
            <Link to="/guidelines" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <span className="text-white/40">|</span>
            <Link to="/about" className="hover:text-white transition-colors">
              Hyperlinking Policy
            </Link>
            <span className="text-white/40">|</span>
            <Link to="/about" className="hover:text-white transition-colors">
              Copyright Policy
            </Link>
            <span className="text-white/40">|</span>
            <Link to="/about" className="hover:text-white transition-colors">
              Accessibility Statement
            </Link>
            <span className="text-white/40">|</span>
            <Link to="/about" className="hover:text-white transition-colors">
              Disclaimer
            </Link>
            <span className="text-white/40">|</span>
            <Link to="/resources/guidelines" className="hover:text-white transition-colors">
              Useful Links
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-[#1a4d2e] py-3">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs text-white/70 text-center space-y-1">
            <p>
              PARIVESH portal is Designed, Developed and Hosted by National Informatics Centre, Ministry of Electronics & IT (MeitY) | Government of India
            </p>
            <p>
              © 2024. Content Owned, Updated and Maintained by Ministry of Environment,Forest and Climate Change, Government of India
            </p>
            <p className="text-white/50">
              This Site is best viewed in 1024 x 768 resolution with latest version of Chrome, Firefox, Safari and Internet Explorer
            </p>
            <p className="text-white font-medium mt-2">Last Updated on 13th March 2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
