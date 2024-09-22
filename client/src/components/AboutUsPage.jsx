import React from 'react'

export default function AboutUsPage() {
  
    return (
      <div className="max-w-7xl mx-auto">
      <header className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg">Welcome to Game Haven – Your Ultimate Destination for the Best Gaming Titles!</p>
      </header>
      <section className="py-12">
        <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg leading-8">
          At Gamerz Arena, we are passionate about bringing the latest and greatest video games to gamers everywhere.
          Whether you're a fan of AAA blockbusters or indie gems, our mission is to provide a seamless and enjoyable
          shopping experience for every type of gamer.
        </p>
      </section>
     <section className="py-12">
  <h2 className="text-3xl font-semibold mb-4 text-center">Meet the Team</h2>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="team-member lg:text-left text-center">
      <h3 className="text-2xl font-bold border-b-2 border-gray-400 pb-2">Farhan Islam Ifti</h3>
      <p className="text-lg">Farhan is a lifelong gamer with a vision to bring gamers closer to their favorite titles through innovation and exceptional service.</p>
      <p className="text-gray-400">farhangeneral@gmail.com </p>
      <p className="text-lg">
        <strong>Facebook:</strong>
        <a href="https://www.facebook.com/farhamislam.ifti" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
          Farhan Islam Ifti
        </a>
      </p>
    </div>
    <div className="team-member lg:text-right text-center">
      <h3 className="text-2xl font-bold border-b-2 border-gray-400 pb-2">Asaduzzaman Limon</h3>
      <p className="text-lg">Limon is the mastermind behind the technology powering Game Haven, ensuring a smooth and reliable experience for our users.</p>
      <p className="text-gray-400">adilarian420@gmail.com</p>
      <p className="text-lg">
        <strong>Facebook:</strong>
        <a href="https://www.facebook.com/zaman.limon.5/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
          Asaduzzaman Limon
        </a>
      </p>
    </div>
  </div>
</section>

      <section className="py-12">
        <h2 className="text-3xl font-semibold mb-4">Our Core Values</h2>
        <ul className="list-disc list-inside text-lg leading-8">
          <li><strong>Customer-Centric:</strong> We put our customers first and strive to exceed their expectations with every interaction.</li>
          <li><strong>Innovation:</strong> We are constantly exploring new ways to enhance the gaming experience.</li>
          <li><strong>Passion for Gaming:</strong> We love games, and we are committed to sharing that love with our community.</li>
          <li><strong>Integrity:</strong> We operate with transparency, honesty, and respect in all our dealings.</li>
        </ul>
      </section>
      <footer className="text-center py-8">
        <p>&copy; {new Date().getFullYear()} Gamerz Arena. All Rights Reserved.</p>
      </footer>
    </div>
    )
  
}
