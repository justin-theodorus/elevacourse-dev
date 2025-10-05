import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-400 to-blue-600">
        <div className="text-white text-xl font-bold">
          ElevaCourse
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              Sign in
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Sign up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-400 to-blue-600 px-6 py-20 text-center text-white overflow-hidden">
        {/* Background circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 rounded-full border border-white/20"></div>
          <div className="absolute w-80 h-80 rounded-full border border-white/30"></div>
          <div className="absolute w-64 h-64 rounded-full border border-white/40"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block bg-white/20 rounded-full px-6 py-2 mb-8">
            <span className="text-sm">Your no. 1 holistic student development with smart AI-Personalized</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            The Future of Artificial Intelligence
            <br />
            Starts Here!
          </h1>
          
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            A leading AI platform that provides intelligent solutions for essays, research, business
            plans, and personality analysis using the latest machine learning technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Get started →
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-blue-600 hover:bg-white/10 px-8 py-3">
              Learn more
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-600 mb-4">
              ElevaCourse Features
            </h2>
            <p className="text-gray-600 text-lg">
              The best investment for your personal development.
            </p>
          </div>

          <div className="space-y-20">
            {/* AI Essay Generator */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="w-80 h-80 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl"></div>
              </div>
              <div className="lg:w-1/2">
                <h3 className="text-3xl font-bold text-blue-600 mb-4">
                  AI Essay Generator
                </h3>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor
                </h4>
                <p className="text-gray-600 mb-6">
                  lorem ipsum dolor sit amet consectetur adipiscing elit sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua lorem
                  ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod?
                </p>
                <Button variant="outline" className="rounded-full px-8">
                  Learn more
                </Button>
              </div>
            </div>

            {/* Smart Analytics */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2">
                <div className="w-80 h-80 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl"></div>
              </div>
              <div className="lg:w-1/2">
                <h3 className="text-3xl font-bold text-blue-600 mb-4">
                  Smart Analytics
                </h3>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor
                </h4>
                <p className="text-gray-600 mb-6">
                  lorem ipsum dolor sit amet consectetur adipiscing elit sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua lorem
                  ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod?
                </p>
                <Button variant="outline" className="rounded-full px-8">
                  Learn more
                </Button>
              </div>
            </div>

            {/* Business Intelligence */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="w-80 h-80 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl"></div>
              </div>
              <div className="lg:w-1/2">
                <h3 className="text-3xl font-bold text-blue-600 mb-4">
                  Business Intelligence
                </h3>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor
                </h4>
                <p className="text-gray-600 mb-6">
                  lorem ipsum dolor sit amet consectetur adipiscing elit sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua lorem
                  ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod?
                </p>
                <Button variant="outline" className="rounded-full px-8">
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 bg-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                There're many more features
              </h3>
              <p className="text-gray-600 mb-6">
                lorem ipsum dolor sit amet consectetur adipiscing elit
                sed do eiusmod tempor
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Explore
              </Button>
            </div>
            <div className="lg:w-1/2">
              <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            More than <span className="font-extrabold">10,000+</span> students have been helped
          </h2>
          <h3 className="text-2xl mb-12">
            by <span className="font-bold">ElevaCourse</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-sm mb-4 opacity-90">
                  lorem ipsum dolor sit amet sed do
                  consectetur adipiscing elit sed do
                  eiusmod tempor
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full mr-3"></div>
                  <span className="font-semibold">Lorem ipsum</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Let's Start Learning Today!
              </h2>
              <p className="text-gray-600 mb-8">
                Don't wait until tomorrow to become the best version of yourself.
                Join thousands of Indonesian students who have achieved success
                more easily with <span className="font-semibold">ElevaCourse</span>
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Register Now!
                </Button>
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="w-full h-80 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16 px-6 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">ElevaCourse</h3>
              <p className="text-gray-600">
                ElevaCourse is here to help Indonesian
                students learn more effectively with
                technology. Our vision is to create a
                generation of students who are
                independent, intelligent, and ready to face
                the future.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact us</h4>
              <div className="space-y-2 text-gray-600">
                <p>support@elevacourse.com</p>
                <p>+62 xxx-xxxx-xxxx</p>
                <p>Jl. H. Mulyadi 12, BSD, Jakarta Pusat, Indonesia</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Follow us</h4>
              <div className="space-y-3">
                {['@elevated', '@elevated', '@elevated'].map((handle, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                    <span className="text-gray-600">{handle}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-gray-500">
            <p>© 2025 ElevatEd Indonesia. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
