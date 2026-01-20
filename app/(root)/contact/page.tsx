'use client'

import React, { useState } from 'react';
import { MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    orderNumber: '',
    comment: ''
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "How To Order?",
      answer: "You can place your order directly through our website by browsing our products, adding items to your cart, and proceeding to checkout. Alternatively, you can visit our showroom or contact us via phone or email to place an order with assistance from our team."
    },
    {
      id: 2,
      question: "How Long Does It Take For The Delivery And What Are The Charges?",
      answer: [
        "The Standard Delivery Time Of Orders In Colombo Is Within 2 Working Days. Island-wide Delivery Will Be Made Within 3-4 Working Days.",
        "Delivery Charges Within Colombo Will Vary Based On Location Starting From LKR 299",
        "Pick-up Of Orders Is Available Through Monday To Saturday From 10am To 7pm."
      ]
    },
    {
      id: 3,
      question: "What Information Should Be Provided And How Secured Is The Website?",
      answer: "When placing an order, you'll need to provide your name, contact information, delivery address, and payment details. Our website uses SSL encryption and secure payment gateways to protect your personal and financial information. We comply with industry-standard security practices to ensure your data is safe."
    },
    {
      id: 4,
      question: "What Is SimplyTek's Return And Refund Policy?",
      answer: "We accept returns within 7 days of delivery for unopened products in original packaging. Defective items can be exchanged or refunded within the warranty period. Please contact our customer service team to initiate a return. Refunds are processed within 7-10 business days after we receive the returned item."
    },
    {
      id: 5,
      question: "What Is The Warranty Period For Electronics?",
      answer: "Warranty periods vary by product and brand. Most electronics come with a manufacturer's warranty ranging from 6 months to 2 years. Specific warranty information is provided on each product page and with your purchase documentation. We also offer extended warranty options for select products."
    }
  ];

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add your form submission logic here
    alert('Message sent successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto px-4">
          Stay In Touch With Us! Contact Us For Any Inquiries Or Questions You May Have.
        </p>
      </div>

      {/* Store Locator Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
          Store Locator
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Store Information */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="text-red-500" size={28} />
              Visit Our Showroom
            </h3>
            
            <div className="mb-6">
              <a 
                href="https://maps.google.com/?q=SimplyTek+Thimbirigasyaya" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold text-lg"
              >
                SK-Electricals (Pvt) Ltd
              </a>
            </div>

            <div className="mb-8 text-gray-700 space-y-1">
              <p>No.178,</p>
              <p>Rajawewa,</p>
              <p>Ampara , Eastern 32000, Sri Lanka</p>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={24} />
                Open Time
              </h4>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-semibold">Weekdays:</span> 10 AM to 7 PM</p>
                <p><span className="font-semibold">Friday:</span> 10 AM to 5 PM</p>
                <p><span className="font-semibold">Saturday:</span> 10 AM to 6 PM</p>
              </div>
              <div className="border-t pt-6 mt-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  Call Us
                </h4>
                <div className="text-gray-700">
                  <p><span className="font-semibold">Phone No :</span>+94 71 234 5678 | +94 77 123 4567</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798900826653!2d79.86358631477292!3d6.914762695009488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2596d3b0c4c6d%3A0x5e0b5c5f5e0b5c5f!2sThimbirigasyaya%20Rd%2C%20Colombo!5e0!3m2!1sen!2slk!4v1234567890123!5m2!1sen!2slk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Send us your message
          </h2>

          <div className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Phone Number */}
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Inquiry Type Dropdown */}
            <select
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            >
              <option value="">Inquiry Type</option>
              <option value="general">General Inquiry</option>
              <option value="product">Product Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="order">Order Status</option>
              <option value="other">Other</option>
            </select>

            {/* Order Number */}
            <input
              type="text"
              name="orderNumber"
              placeholder="Order Number (If Applicable)"
              value={formData.orderNumber}
              onChange={handleChange}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Comment Textarea */}
            <textarea
              name="comment"
              placeholder="Comment"
              value={formData.comment}
              onChange={handleChange}
              rows={6}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition duration-300 text-lg shadow-lg"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Empty space for layout */}
          <div className="hidden md:block">
            {/* Empty space to match the design */}
          </div>

          {/* Right Side - FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border-b border-gray-200">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full py-6 flex items-center justify-between text-left hover:text-gray-600 transition-colors"
                >
                  <span className="text-lg font-medium text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  {openFaq === faq.id ? (
                    <ChevronUp className="flex-shrink-0 w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="flex-shrink-0 w-5 h-5 text-gray-600" />
                  )}
                </button>
                
                {openFaq === faq.id && (
                  <div className="pb-6 text-gray-700">
                    {Array.isArray(faq.answer) ? (
                      <ul className="space-y-3">
                        {faq.answer.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{faq.answer}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explore More Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {/* About Us Card */}
            <div className="relative rounded-2xl overflow-hidden h-[400px] group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop" 
                  alt="About Us" 
                  className="w-full h-full object-cover mix-blend-overlay"
                />
              </div>
              <div className="relative h-full flex flex-col items-center justify-center text-center px-8 z-10">
                <h3 className="text-4xl font-bold text-white mb-4">About Us</h3>
                <p className="text-white text-lg mb-8">
                  Discover the our brand story behind
                </p>
                <button className="bg-white text-gray-900 px-10 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300">
                  Explore
                </button>
              </div>
            </div>

            {/* FAQ Card */}
            <div className="relative rounded-2xl overflow-hidden h-[400px] group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-b from-green-900/60 to-green-900/80">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop" 
                  alt="FAQ" 
                  className="w-full h-full object-cover mix-blend-overlay"
                />
              </div>
              <div className="relative h-full flex flex-col items-center justify-center text-center px-8 z-10">
                <h3 className="text-4xl font-bold text-white mb-4">F.A.Q</h3>
                <p className="text-white text-lg mb-8">
                  Find answers to all your questions
                </p>
                <button className="bg-white text-gray-900 px-10 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300">
                  Explore
                </button>
              </div>
            </div>

            {/* Corporate Sales Card */}
            <div className="relative rounded-2xl overflow-hidden h-[400px] group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60">
                <img 
                  src="https://bleuwire.com/wp-content/uploads/2020/10/CCTV-monitoring.jpg" 
                  alt="Corporate Sales" 
                  className="w-full h-full object-cover mix-blend-overlay"
                />
              </div>
              <div className="relative h-full flex flex-col items-center justify-center text-center px-8 z-10">
                <h3 className="text-4xl font-bold text-white mb-4">Corporate sales</h3>
                <p className="text-white text-lg mb-8">
                  Discover the Best Deals for Corporate Sales!
                </p>
                <button className="bg-white text-gray-900 px-10 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300">
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;