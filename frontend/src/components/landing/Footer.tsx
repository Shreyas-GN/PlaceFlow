import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Solutions", href: "#solutions" },
    { label: "Workflow", href: "#workflow" },
    { label: "Pricing", href: "#pricing" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Help Center", href: "/help" },
    { label: "API Reference", href: "/api-docs" },
    { label: "Status", href: "/status" },
  ],
  Support: [
    { label: "Contact Us", href: "mailto:support@placeflow.app" },
    { label: "Sales", href: "mailto:sales@placeflow.app" },
    { label: "Community", href: "/community" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Security", href: "/security" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#FAFAF8] border-t border-gray-200 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <span className="text-base font-semibold tracking-tight text-gray-900 mb-6 block">
              PlaceFlow
            </span>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
              The institutional platform for managing campus placement workflows.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} PlaceFlow. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-400">Version 3.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
