export default function GuestFooter() {
  return (
    <footer className="bg-auto text-black py-5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between">
          {/* Company Info */}
          <div className="flex-1 md:text-center">
            <h2 className="text-2xl font-bold">LUNARIST</h2>
            <p className="text-gray-800 mt-2">
              &copy; {new Date().getFullYear()} LUNARIST. All rights reserved.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap gap-8 md:justify-center md:w-full mt-4 md:mt-6">
            <a href="/about-us" className="text-black hover:text-blue-400">
              About Us
            </a>
            <a href="/community-us" className="text-black hover:text-blue-400">
              Community
            </a>
            <a href="/contact" className="text-black hover:text-blue-400">
              Contact
            </a>
            <a
              href="/privacy-policy"
              className="text-black hover:text-blue-400"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-black hover:text-blue-400"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
