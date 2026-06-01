import LegalPage from "@/components/legal/LegalPage";

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "platform-purpose", label: "Platform Purpose" },
  { id: "accounts", label: "Accounts & Access" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "institutional-responsibility", label: "Institutional Responsibility" },
  { id: "recruiter-student-data", label: "Recruiter & Student Data" },
  { id: "availability", label: "Availability" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "termination", label: "Termination" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="The rules and guidelines for using PlaceFlow."
      lastUpdated="May 2026"
      sections={sections}
    >
      <h2 id="introduction">Introduction</h2>
      <p>
        These Terms of Service (“Terms”) govern access to and use of PlaceFlow, including all related services,
        dashboards, workflows, and placement management features.
      </p>
      <p>
        By accessing or using PlaceFlow, you agree to these Terms. If you do not agree, you should not use the platform.
      </p>

      <h2 id="platform-purpose">Platform Purpose</h2>
      <p>
        PlaceFlow is designed to assist institutions, placement cells, recruiters, and students in managing placement operations including:
      </p>
      <ul>
        <li>placement drives</li>
        <li>applications</li>
        <li>eligibility workflows</li>
        <li>interviews</li>
        <li>recruiter coordination</li>
        <li>offer management</li>
      </ul>
      <p>
        PlaceFlow does not guarantee placement outcomes, employment offers, or hiring decisions.
      </p>

      <h2 id="accounts">Accounts & Access</h2>
      <p>Users are responsible for:</p>
      <ul>
        <li>maintaining account security</li>
        <li>protecting login credentials</li>
        <li>ensuring information accuracy</li>
        <li>complying with institutional policies</li>
      </ul>
      <p>Institutions may control or revoke platform access for authorized users.</p>

      <h2 id="acceptable-use">Acceptable Use</h2>
      <p>Users agree not to:</p>
      <ul>
        <li>misuse platform functionality</li>
        <li>attempt unauthorized access</li>
        <li>upload malicious content</li>
        <li>interfere with system operations</li>
        <li>impersonate other users or institutions</li>
        <li>use the platform for unlawful activity</li>
      </ul>
      <p>We reserve the right to suspend accounts involved in misuse or harmful activity.</p>

      <h2 id="institutional-responsibility">Institutional Responsibility</h2>
      <p>Institutions using PlaceFlow remain responsible for:</p>
      <ul>
        <li>placement policies</li>
        <li>eligibility decisions</li>
        <li>recruiter communication</li>
        <li>hiring workflows</li>
        <li>operational compliance</li>
      </ul>
      <p>PlaceFlow provides software infrastructure but does not control institutional decision-making.</p>

      <h2 id="recruiter-student-data">Recruiter & Student Data</h2>
      <p>Users must handle platform data responsibly.</p>
      <ul>
        <li>Recruiters may access only authorized candidate information.</li>
        <li>Students remain responsible for submitted applications, uploaded resumes, and provided information.</li>
      </ul>

      <h2 id="availability">Availability and Changes</h2>
      <p>We may:</p>
      <ul>
        <li>improve or modify platform functionality</li>
        <li>add or remove features</li>
        <li>perform maintenance or updates</li>
      </ul>
      <p>While we aim for reliable availability, uninterrupted access cannot be guaranteed.</p>

      <h2 id="intellectual-property">Intellectual Property</h2>
      <p>All platform software, workflows, branding, and interface systems are owned by PlaceFlow unless otherwise stated.</p>
      <p>Users may not copy, reverse engineer, distribute, or reproduce platform components without permission.</p>

      <h2 id="liability">Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, PlaceFlow is not liable for:</p>
      <ul>
        <li>hiring outcomes</li>
        <li>recruiter decisions</li>
        <li>institutional policy actions</li>
        <li>data loss caused by third-party failures</li>
        <li>temporary service interruptions</li>
      </ul>
      <p>Use of the platform is at the user’s own risk.</p>

      <h2 id="termination">Termination</h2>
      <p>We may suspend or terminate access if:</p>
      <ul>
        <li>these Terms are violated</li>
        <li>platform misuse occurs</li>
        <li>security risks are detected</li>
        <li>institutional authorization is revoked</li>
      </ul>

      <h2 id="changes">Changes to Terms</h2>
      <p>We may update these Terms periodically.</p>
      <p>Continued use of PlaceFlow after updates constitutes acceptance of revised Terms.</p>

      <h2 id="contact">Contact</h2>
      <p>
        For questions regarding these Terms, contact:
        <a href="mailto:support@placeflow.app">support@placeflow.app</a>
      </p>
    </LegalPage>
  );
}
