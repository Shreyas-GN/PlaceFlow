import LegalPage from "@/components/legal/LegalPage";

const sections = [
  { id: "acceptance", label: "Acceptance" },
  { id: "accounts", label: "Accounts" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "data-responsibility", label: "Data Responsibility" },
  { id: "platform-limitations", label: "Platform Limitations" },
  { id: "termination", label: "Termination" },
  { id: "liability", label: "Liability" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="The rules and guidelines for using PlaceFlow."
      lastUpdated="May 25, 2026"
      sections={sections}
    >
      <h2 id="acceptance">Acceptance of Terms</h2>
      <p>
        By accessing or using PlaceFlow, you agree to be bound by these Terms of Service.
        If you do not agree to these terms, do not use the platform.
      </p>
      <p>
        PlaceFlow is provided to educational institutions and their authorized users
        (students, placement officers, and recruiters) for placement coordination purposes.
      </p>

      <h2 id="accounts">Account Responsibilities</h2>
      <p>Users are responsible for:</p>
      <ul>
        <li>Maintaining the confidentiality of their login credentials.</li>
        <li>All activities that occur under their account.</li>
        <li>Providing accurate and up-to-date information.</li>
        <li>Not sharing accounts or credentials with unauthorized parties.</li>
      </ul>
      <p>
        Each user must have only one account. Accounts are tied to your institutional identity
        and cannot be transferred.
      </p>

      <h2 id="acceptable-use">Acceptable Use</h2>
      <p>You agree to use PlaceFlow only for legitimate placement-related activities:</p>
      <ul>
        <li>Students may apply to placement drives they are eligible for.</li>
        <li>Placement officers may manage drives, review applications, and coordinate scheduling.</li>
        <li>Recruiters may view applicant data only for drives they are authorized to access.</li>
      </ul>
      <p>You may not:</p>
      <ul>
        <li>Use the platform for any illegal or unauthorized purpose.</li>
        <li>Attempt to access data beyond your authorized scope.</li>
        <li>Game the system by submitting fraudulent applications or data.</li>
        <li>Interfere with the platform&apos;s operation or security.</li>
        <li>Scrape, crawl, or extract data without authorization.</li>
      </ul>

      <h2 id="data-responsibility">Data Responsibility</h2>
      <p>
        Students are responsible for the accuracy of their academic data. Institutions are responsible
        for verifying student eligibility and managing placement workflows.
      </p>
      <p>
        Recruiters accessing applicant data agree to use it solely for recruitment purposes
        and to comply with applicable data protection laws.
      </p>

      <h2 id="platform-limitations">Platform Limitations</h2>
      <p>
        PlaceFlow is provided &quot;as is&quot; without warranty of any kind. While we strive for
        high availability and reliability, we do not guarantee that the platform will be
        uninterrupted or error-free.
      </p>
      <p>
        PlaceFlow is a coordination tool. It does not guarantee placement outcomes.
        The platform facilitates applications, scheduling, and communication, but does not
        make hiring decisions.
      </p>

      <h2 id="termination">Termination</h2>
      <p>
        We reserve the right to suspend or terminate accounts that violate these terms.
        Institutions may deactivate user accounts as needed.
      </p>
      <p>
        Upon termination, your access to the platform will be revoked. Data will be handled
        according to our Privacy Policy and data retention practices.
      </p>

      <h2 id="liability">Limitation of Liability</h2>
      <p>
        PlaceFlow and its operators shall not be liable for any indirect, incidental, or
        consequential damages arising from the use of the platform. Our total liability
        shall not exceed the fees paid (if any) for using the platform.
      </p>
      <p>
        We are not responsible for the actions of recruiters, students, or institutions
        using the platform. Disputes between parties should be resolved through
        institutional processes.
      </p>

      <h2 id="changes">Changes to Terms</h2>
      <p>
        We may update these terms from time to time. Users will be notified of material
        changes via the platform or email. Continued use after changes constitutes
        acceptance of the new terms.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        For questions about these terms, contact us at{" "}
        <a href="mailto:legal@placeflow.app">legal@placeflow.app</a>.
      </p>
    </LegalPage>
  );
}
