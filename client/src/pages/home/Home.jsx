import React, { useEffect, useState } from 'react';
import { Footer, Navbar } from '../../components';

const Home = () => {
  // Fade-in animation for sections on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
        }
      });
    }, { threshold: 0.2 });
    
    document.querySelectorAll('.fade-in').forEach(section => {
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);

  const [activeCategory, setActiveCategory] = useState('portraits');
  
  const categories = [
    { id: 'portraits', label: 'Portraits' },
    { id: 'weddings', label: 'Weddings' },
    { id: 'events', label: 'Events' },
    { id: 'nature', label: 'Nature' }
  ];
  
  // Gallery images by category
  const galleryImages = {
    portraits: [
      { 
        src: 'https://www.jasminbauerphotography.com/wp-content/uploads/2020/04/woman-dressed-in-black-leaning-over-a-ladder.jpg', 
        title: 'Professional Portrait',
        category: 'Corporate'
      },
      { 
        src: 'https://paulinaduczman.com/wp-content/uploads/2021/05/Family-Photoshoot-Mum-Dad-Children-819x1024.jpg', 
        title: 'Family Portrait',
        category: 'Family'
      },
      { 
        src: 'https://images-pw.pixieset.com/elementfield/4mV10lL/JudithBelleCreativeBrandingLinkedinIndividualPortraitsPhotosJohannesburgRosebankSandtonHoughtonParkhurstLindenJoziMabonengMelvilleSouthAfrica-59c59d3b-1500.jpg', 
        title: 'Creative Headshot',
        category: 'Individual'
      },
      { 
        src: 'https://mountstudio.com.sg/wp-content/uploads/2024/05/gardens-by-the-bay-outdoor-couple-portrait-photography-singapore-3-optimized.jpg', 
        title: 'Outdoor Portrait',
        category: 'Lifestyle'
      }
    ],
    weddings: [
      { 
        src: 'https://labellecouture.com.sg/wp-content/uploads/2023/02/pre-wedding-photoshoot-ideas-2023-1440x960.jpg', 
        title: 'Wedding Ceremony',
        category: 'Ceremony'
      },
      { 
        src: 'https://shotkit.com/wp-content/uploads/2024/01/candid-hong-son.jpeg', 
        title: 'First Dance',
        category: 'Reception'
      },
      { 
        src: 'https://images-pw.pixieset.com/page/1577554/PRO_1153-88d92815.jpg', 
        title: 'Bridal Portrait',
        category: 'Bridal'
      },
      { 
        src: 'https://jjstudiosphiladelphia.com/wp-content/uploads/2021/10/Mansion-on-Main-Street-wedding-by-JJ-Studios-51.jpg', 
        title: 'Venue Details',
        category: 'Details'
      }
    ],
    events: [
      { 
        src: '/api/placeholder/600/600', 
        title: 'Corporate Gathering',
        category: 'Corporate'
      },
      { 
        src: '/api/placeholder/600/600', 
        title: 'Gala Dinner',
        category: 'Formal'
      },
      { 
        src: '/api/placeholder/600/600', 
        title: 'Conference Presentation',
        category: 'Conference'
      },
      { 
        src: '/api/placeholder/600/600', 
        title: 'Birthday Celebration',
        category: 'Birthday'
      }
    ],
    nature: [
      { 
        src: '/api/placeholder/600/600', 
        title: 'Mountain Landscape',
        category: 'Landscape'
      },
      { 
        src: '/api/placeholder/600/600', 
        title: 'Forest Detail',
        category: 'Macro'
      },
      { 
        src: '/api/placeholder/600/600', 
        title: 'Ocean Sunset',
        category: 'Sunset'
      },
      { 
        src: '/api/placeholder/600/600', 
        title: 'Wildlife Portrait',
        category: 'Wildlife'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-l from-primary/10 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-gradient-to-t from-secondary/10 to-transparent rounded-tr-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="md:flex items-center">
            <div className="md:w-1/2 text-center md:text-left md:pr-12">
              <h1 className="text-5xl md:text-6xl font-heading font-bold text-dark leading-tight">
                Capture Your <span className="text-primary">Perfect</span> Moments
              </h1>
              <p className="text-xl text-gray-600 mt-6 mb-8 max-w-lg md:mx-0 mx-auto">
                Professional photography services tailored to your vision. We transform ordinary moments into extraordinary memories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Book a Session
                </button>
                <button className="bg-transparent hover:bg-gray-100 text-gray-800 border border-gray-300 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300">
                  View Our Work
                </button>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-accent2/30 animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-secondary/20 animate-pulse delay-700"></div>
                <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500">
                  {/* Replace with actual image */}
                  <div className="aspect-[4/3] bg-gray-200">
                    <div className="w-full h-full bg-gradient-to-br from-gray to-white">
                        <img src="https://media.flytographer.com/uploads/2023/01/1-photoshoot-outfits-flytographer-lisbon-photographer.jpeg" alt="" srcset="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark inline-block relative">
              Our Services
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              From intimate portraits to grand events, we bring creativity and professionalism to every shoot.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Portrait Sessions",
                description: "Professional individual and family portraits that capture genuine emotions and personalities.",
                icon: "📸",
                color: "bg-accent3/10 text-accent3",
                borderColor: "border-accent3/30"
              },
              {
                title: "Wedding Photography",
                description: "Documenting your special day with a perfect blend of candid moments and artistic compositions.",
                icon: "💍",
                color: "bg-secondary/10 text-secondary",
                borderColor: "border-secondary/30"
              },
              {
                title: "Event Coverage",
                description: "Comprehensive coverage of corporate events, parties, and special occasions with attention to detail.",
                icon: "🎉",
                color: "bg-accent2/10 text-accent2",
                borderColor: "border-accent2/30"
              }
            ].map((service, index) => (
              <div 
                key={index} 
                className="p-8 rounded-xl border bg-white hover:bg-gray-50 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-dark mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                <a href="#" className="inline-block mt-6 text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                  Learn more →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 bg-gray-50 fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark inline-block relative">
            Featured Work
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            A glimpse into our portfolio showcasing our creative vision and technical expertise.
          </p>
        </div>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center mb-12 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {/* Gallery Grid with Animation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {galleryImages[activeCategory].map((image, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-xl aspect-square shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img 
                src={image.src} 
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h4 className="text-white font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{image.title}</h4>
                <p className="text-gray-200 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">{image.category}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href={`/gallery/${activeCategory}`}
            className="inline-flex items-center px-8 py-3 border border-gray-300 rounded-lg text-primary hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 font-medium"
          >
            View Full {categories.find(cat => cat.id === activeCategory)?.label} Gallery
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark inline-block relative">
              Client Testimonials
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it — see what our clients have to say.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Wedding Client",
                image: "https://i.pravatar.cc/100?img=1",
                quote: "PhotoPro captured our wedding day perfectly. Every emotion, every detail - their work was beyond our expectations."
              },
              {
                name: "Michael Chen",
                role: "Corporate Event",
                image: "https://i.pravatar.cc/100?img=3",
                quote: "Professional, unobtrusive, and delivered amazing results. Our company events have never looked so good."
              },
              {
                name: "Emily Rodriguez",
                role: "Family Portraits",
                image: "https://i.pravatar.cc/100?img=5",
                quote: "They have a gift for capturing personalities. Our family photos are treasures we'll cherish forever."
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="p-6 md:p-8 rounded-xl border bg-white shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                    {/* Replace with actual image */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-100"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-dark">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="text-gray-600 italic">"{testimonial.quote}"</blockquote>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-blue-700 text-white fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5"></div>
          
          <div className="text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-8">
              Ready to Create Lasting Memories?
            </h2>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100">
              Our team of professional photographers is ready to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary hover:bg-blue-50 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Get Started Today
              </button>
              <button className="bg-transparent hover:bg-white/10 text-white border border-white/30 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      
    </div>
  );
};

export default Home;