import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'Rings', path: '/products?category=rings' },
      { name: 'Bracelets', path: '/products?category=bracelets' },
      { name: 'Necklaces', path: '/products?category=necklaces' },
      { name: 'Earrings', path: '/products?category=earrings' },
      { name: 'Charms', path: '/products?category=charms' },
      { name: 'Gifts', path: '/products?category=gifts' }
    ],
    help: [
      { name: 'FAQ', path: '/faq' },
      { name: 'Shipping', path: '/shipping' },
      { name: 'Returns', path: '/returns' },
      { name: 'Size Guide', path: '/size-guide' },
      { name: 'Contact Us', path: '/contact' }
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Blog', path: '/blog' },
      { name: 'Stores', path: '/stores' }
    ]
  };

  return (
    <footer className="bg-gradient-to-b from-black-900 via-black-900 to-black-950 text-white">
      {/* Main footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <h2 className="font-serif text-2xl font-bold tracking-wider">
                BLACK <span className="text-gold-500">&</span> GOLD
              </h2>
            </Link>
            <p className="text-black-300 mb-6 max-w-sm leading-relaxed">
              Discover hand-crafted jewellery for every style. Timeless pieces that tell your unique story.
            </p>
            
            {/* Contact info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start text-black-300 gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-600/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-gold-500" />
                </div>
                <span>Shop #123, Main Boulevard, Karachi, Sindh 75500, Pakistan</span>
              </div>
              <div className="flex items-start text-black-300 gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-600/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-gold-500" />
                </div>
                <span>+92 21 12345678</span>
              </div>
              <div className="flex items-start text-black-300 gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-600/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-gold-500" />
                </div>
                <span>info@blackgold.com</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex space-x-4">
              <a href="#" className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center hover:from-gold-600 hover:to-gold-700 transition-all duration-300 transform hover:scale-110 shadow-lg">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center hover:from-gold-600 hover:to-gold-700 transition-all duration-300 transform hover:scale-110 shadow-lg">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center hover:from-gold-600 hover:to-gold-700 transition-all duration-300 transform hover:scale-110 shadow-lg">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-gold-400 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gold-500"></span>
              Shop
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-black-300 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-gold-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-gold-400 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gold-500"></span>
              Help
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-black-300 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-gold-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-gold-400 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gold-500"></span>
              Company
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-black-300 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-gold-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter - Enhanced */}
      <div className="border-t border-black-800">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-block mb-4">
              <div className="w-16 h-1 bg-gradient-to-r from-gold-500 to-gold-700 rounded-full"></div>
            </div>
            <h3 className="font-serif text-2xl font-semibold mb-3 text-white">Subscribe to Our Newsletter</h3>
            <p className="text-black-400 mb-6">
              Get exclusive offers, new arrivals, and <span className="text-gold-400 font-semibold">10% off</span> your first order.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field flex-1 bg-black-800 border-black-700 text-white placeholder-black-500 focus:border-gold-500"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-black-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-black-400 text-sm">
              © {currentYear} Black & Gold. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-black-400 hover:text-gold-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-black-400 hover:text-gold-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-black-400 hover:text-gold-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
