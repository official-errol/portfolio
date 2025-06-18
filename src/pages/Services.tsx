import React from 'react'

const Services: React.FC = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-10 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-main-dark">Graphic Design Services</h1>

        {/* Branding Packages */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-primary-light">🎨 Logo & Brand Visual Identity</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-lg mb-2">Basic</h3>
              <p>Logo Design Only</p>
              <p className="font-semibold mt-2 text-main-dark">P3,000 – P5,000+</p>
            </div>
            <div className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-lg mb-2">Standard</h3>
              <p>Logo + Brand Guide</p>
              <p className="font-semibold mt-2 text-main-dark">P15,000 – P30,000+</p>
            </div>
            <div className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-lg mb-2">Premium</h3>
              <p>Logo + Full Brand Guide, Poster, Stationeries</p>
              <p className="font-semibold mt-2 text-main-dark">P40,000 – P50,000+</p>
            </div>
          </div>
        </div>

        {/* Printables Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-primary-light">🖨️ Printables</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              ['Flyer (1–2 pages)', 'P1,000 – P1,500'],
              ['Flyer (1–3 pages)', 'P2,000 – P3,000'],
              ['Poster', 'P1,000 – P3,000'],
              ['Banner', 'P1,500 – P3,000'],
              ['Business Card', 'P1,500 – P2,000'],
              ['Invitation Card', 'P2,000 – P2,500'],
              ['Letterhead', 'P1,000 – P1,500'],
              ['Certificate', 'P1,500 – P2,000'],
              ['Corporate Folder', 'P1,200 – P1,500']
            ].map(([item, price]) => (
              <div key={item} className="flex justify-between border-b py-2">
                <span>{item}</span>
                <span className="font-semibold text-main-dark">{price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Artwork Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-primary-light">💻 Digital Artwork & Editing</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              ['Menu Design', 'P3,000 – P5,000'],
              ['Photo Editing', 'P500 – P1,500'],
              ['Product Label', 'P4,000 – P8,000'],
              ['Photomanipulation', 'P1,000 – P3,000'],
              ['Product Packaging', 'P2,000 – P5,000'],
              ['Event / Movie Poster', 'P5,000 – P10,000']
            ].map(([item, price]) => (
              <div key={item} className="flex justify-between border-b py-2">
                <span>{item}</span>
                <span className="font-semibold text-main-dark">{price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Packages */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-primary-light">📱 Social Media Design</h2>
          <p className="italic text-sm text-gray-600 mb-2">@charlesandrei.designs</p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              ['Facebook / IG Post', 'P500 – P1,000'],
              ['10 Posts', 'P8,000 – P10,000'],
              ['20 Posts', 'P15,000 – P20,000'],
              ['30 Posts', 'P25,000 – P30,000'],
              ['Reels / TikTok', 'P1,500 – P3,000'],
              ['Cover Banner', 'P1,000 – P1,500']
            ].map(([item, price]) => (
              <div key={item} className="flex justify-between border-b py-2">
                <span>{item}</span>
                <span className="font-semibold text-main-dark">{price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services
