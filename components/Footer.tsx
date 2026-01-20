import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <section id='footer'>
  <div className='flex flex-col items-center justify-center p-6 md:p-10 bg-gray-800 text-white'>
        <div className='flex flex-col items-center mb-6'>
          <Image src="/logo.png" alt='logo' width={200} height={60} className="w-40 h-auto md:w-[300px] md:h-[100px]"/>
          <span className='text-xl md:text-3xl font-semibold text-center'>"Your Security, Our Priority"</span>
        </div>
        <div className='flex flex-col md:flex-row gap-8 md:gap-20 mb-6 text-base md:text-xl w-full justify-center items-center'>
          <div className='flex flex-col items-center md:items-start'>
            <span className='p-1 md:p-3 text-center md:text-left'>No.178, Rajawewa, Ampara.</span>
            <span className='p-1 md:p-3 text-center md:text-left'>+94 75 244 6520</span>
            <span className='p-1 md:p-3 text-center md:text-left'>+94 71 207 0094</span>
          </div>
          <div className='flex flex-col items-center md:items-start'>
            <Link className='p-1 md:p-3' href='/products'>Products</Link>
            <Link className='p-1 md:p-3' href='/about'>About</Link>
            <Link className='p-1 md:p-3' href='/contact'>Contact</Link>
          </div>
          <div className='flex flex-col items-center md:items-start'>
            <Link className='p-1 md:p-3' href='/privacy'>Privacy Policy</Link>
            <Link className='p-1 md:p-3' href='/terms'>Terms & Conditions</Link>
            <Link className='p-1 md:p-3' href='/sitemap'>Return & Refund Policy</Link>
          </div>
        </div>
        <div className='flex flex-row gap-6 md:gap-8 mb-6'>
          <a href='https://www.facebook.com/profile.php?id=61554966305209&mibextid=ZbWKwL'>
            <Image className='hover:scale-110 transition-transform duration-200 w-8 h-8 md:w-10 md:h-10' src="/facebook.png" alt="Facebook" width={40} height={40} />
          </a>
          <a href='https://wa.me/94752446520'>
            <Image className='hover:scale-110 transition-transform duration-200 w-8 h-8 md:w-10 md:h-10' src="/whatsapp.png" alt="WhatsApp" width={40} height={40} />
          </a>
          <a href="mailto:kanishkadewinda1102@gmail.com">
            <Image className='hover:scale-110 transition-transform duration-200 w-8 h-8 md:w-10 md:h-10' src="/mail.png" alt="Email" width={40} height={40} />
          </a>
        </div>
        <div className='flex flex-col items-center text-gray-400 text-xs md:text-base'>
          <span>@2025 All Right Reserved</span>
        </div>
      </div>
    </section>
  )
}

export default Footer;