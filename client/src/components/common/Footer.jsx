import React from 'react'

const Footer = () => {
  return (
    <div>
        {/* Footer */}
      <footer className="bg-blue-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-heading font-bold mb-6">
                <span className="text-primary">Book</span>Snap
              </h3>
              <p className="text-gray-400 mb-6">Capturing life's beautiful moments since 2023.</p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 text-white">{/* Replace with actual icon */}</div>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'Gallery', 'Pricing', 'About'].map((item) => (
                  <li key={item}>
                    <a href={`/${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors duration-300 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Services</h4>
              <ul className="space-y-3">
                {['Portraits', 'Weddings', 'Events', 'Commercial'].map((service) => (
                  <li key={service}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 inline-block">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Contact</h4>
              <address className="text-gray-400 not-italic space-y-3">
                <p>123 Photo St.<br />Studio City, CA 91604</p>
                <p>
                  <a href="tel:+1234567890" className="hover:text-white transition-colors duration-300">
                    (123) 456-7890
                  </a>
                </p>
                <p>
                  <a href="mailto:hello@photopro.com" className="hover:text-white transition-colors duration-300">
                    hello@photopro.com
                  </a>
                </p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} PhotoPro. All rights reserved.</p>
            <div className="mt-2">
              <a href="#" className="text-gray-500 hover:text-gray-400 mx-2 text-sm">Privacy Policy</a>
              <span className="text-gray-700">|</span>
              <a href="#" className="text-gray-500 hover:text-gray-400 mx-2 text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer