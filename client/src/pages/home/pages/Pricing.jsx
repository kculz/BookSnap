import React from 'react';
import { Navbar } from '../../../components';

const Pricing = () => {
  const pricingPlans = [
    {
      name: "Basic Session",
      price: "$199",
      duration: "1 hour",
      description: "Perfect for individuals or small families looking for a quick professional photoshoot.",
      features: [
        "1-hour photo session",
        "1 location",
        "10 digital edited photos",
        "Online gallery",
        "Print release for personal use"
      ],
      popular: false,
      color: "bg-white"
    },
    {
      name: "Premium Package",
      price: "$399",
      duration: "2 hours",
      description: "Our most popular option for families, couples, and professional headshots.",
      features: [
        "2-hour photo session",
        "2 locations",
        "25 digital edited photos",
        "Online gallery with downloadable images",
        "Print release for personal use",
        "3 professional prints (up to 8×10)"
      ],
      popular: true,
      color: "bg-primary text-white"
    },
    {
      name: "Deluxe Collection",
      price: "$699",
      duration: "4 hours",
      description: "Comprehensive coverage for special events, extended family sessions, or professional portfolios.",
      features: [
        "4-hour photo session",
        "Multiple locations",
        "50 digital edited photos",
        "Online gallery with downloadable images",
        "Print release for personal use",
        "Custom photo album",
        "5 professional prints (up to 11×14)"
      ],
      popular: false,
      color: "bg-white"
    }
  ];

  const additionalServices = [
    {
      name: "Additional Hour",
      price: "$100",
      description: "Extend any session for more locations or outfit changes"
    },
    {
      name: "Extra Edited Photos",
      price: "$15 each",
      description: "Add more professionally edited digital images"
    },
    {
      name: "Rush Processing",
      price: "$75",
      description: "Get your photos within 3 business days"
    },
    {
      name: "Professional Hair & Makeup",
      price: "$150",
      description: "On-location professional styling before your shoot"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-32 pb-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-dark mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Invest in memories that last a lifetime with our professional photography packages.
          </p>
        </div>
      </section>
      
      {/* Pricing Plans */}
      <section className="py-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-2xl shadow-lg overflow-hidden ${plan.popular ? 'md:-mt-6 md:mb-6 scale-105' : ''} transition-all duration-300`}
              >
                <div className={`p-8 ${plan.color}`}>
                  {plan.popular && (
                    <div className="mb-4 text-center">
                      <span className="inline-block px-4 py-1 rounded-full bg-white text-primary text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-dark'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline mb-4">
                    <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-dark'}`}>
                      {plan.price}
                    </span>
                    <span className={`ml-2 ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>
                      / {plan.duration}
                    </span>
                  </div>
                  <p className={`mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  <button 
                    className={`w-full rounded-lg py-3 font-medium transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-white text-primary hover:bg-gray-100' 
                        : 'bg-primary text-white hover:bg-blue-600'
                    }`}
                  >
                    Select Package
                  </button>
                </div>
                <div className="p-8 bg-white">
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg 
                          className="w-5 h-5 text-green-500 mr-3 mt-0.5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Additional Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-dark text-center mb-16 relative inline-block">
            Additional Services
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-dark mb-2">{service.name}</h3>
                <p className="text-2xl font-bold text-primary mb-4">{service.price}</p>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-dark text-center mb-16 relative inline-block">
            Frequently Asked Questions
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
          </h2>
          
          <div className="space-y-6">
            {[
              {
                question: "How far in advance should I book my session?",
                answer: "We recommend booking at least 3-4 weeks in advance to ensure availability, especially during peak seasons (spring and fall). Wedding photography should be booked 6-12 months in advance."
              },
              {
                question: "What is your cancellation policy?",
                answer: "A 50% deposit is required to secure your booking. This deposit is non-refundable but can be transferred to another date if rescheduled at least 72 hours in advance."
              },
              {
                question: "How long until I receive my photos?",
                answer: "Standard delivery time is 2-3 weeks for fully edited photos. Rush processing is available for an additional fee if you need them sooner."
              },
              {
                question: "Do you offer payment plans?",
                answer: "Yes, we offer flexible payment plans for packages over $300. Please contact us for details."
              },
              {
                question: "What should I wear to my photo session?",
                answer: "After booking, we'll send you a complete guide with clothing recommendations based on your session type and location. We're also happy to provide personalized advice."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-dark mb-3">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Ready to Book Your Session?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
            Contact us today to check availability and reserve your preferred date.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-primary hover:bg-blue-50 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
              Book Now
            </button>
            <button className="bg-transparent hover:bg-white/10 text-white border border-white/30 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;