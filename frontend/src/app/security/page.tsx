import LegalPage from "@/components/legal/LegalPage";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "encryption", label: "Encryption" },
  { id: "access-control", label: "Access Control" },
  { id: "data-storage", label: "Data Storage" },
  { id: "backups", label: "Backups" },
  { id: "incident-response", label: "Incident Response" },
  { id: "institutional", label: "Institutional Responsibility" },
  { id: "contact", label: "Contact" },
];

export default function SecurityPage() {
  return (
    <LegalPage
      title="Data & Security Notice"
      subtitle="How PlaceFlow protects your data and maintains system integrity."
      lastUpdated="May 25, 2026"
      sections={sections}
    >
      <h2 id="overview">Overview</h2>
      <p>
        PlaceFlow is built with security as a foundational principle. This document outlines
        the technical and organizational measures we take to protect your data.
      </p>
      <p>
        Our security model follows the principle of least privilege: users and services
        have only the minimum access necessary to perform their functions.
      </p>

      <h2 id="encryption">Encryption</h2>
      <p>Data is encrypted at multiple layers:</p>
      <ul>
        <li><strong>In Transit:</strong> All API and web traffic uses TLS/HTTPS encryption.</li>
        <li><strong>At Rest:</strong> Database storage uses encryption at the volume level.</li>
        <li><strong>Passwords:</strong> All passwords are hashed using bcrypt with a salt factor, never stored in plain text.</li>
        <li><strong>Tokens:</strong> JWT tokens are signed using HS256 and have a 7-day expiry.</li>
      </ul>

      <h2 id="access-control">Access Control</h2>
      <p>The platform implements role-based access control (RBAC):</p>
      <ul>
        <li><strong>Students:</strong> Can view their own applications, eligible companies, and personal data.</li>
        <li><strong>Placement Officers:</strong> Can manage drives, review all applications, and configure platform settings.</li>
        <li><strong>Recruiters:</strong> Can only access data of students who applied to their drives.</li>
      </ul>
      <p>
        Authentication is handled via JWT tokens stored securely in browser local storage.
        Sessions are validated on every API request.
      </p>

      <h2 id="data-storage">Data Storage</h2>
      <p>
        Data is stored in PostgreSQL databases with strict network access controls.
        Database credentials are managed through environment variables and never
        exposed in code.
      </p>
      <p>
        The platform uses parameterized queries for all database operations to prevent
        SQL injection attacks.
      </p>

      <h2 id="backups">Backups</h2>
      <p>
        Regular database backups are performed to ensure data durability. Backup frequency
        and retention are configured at the institutional level based on requirements.
      </p>

      <h2 id="incident-response">Incident Response</h2>
      <p>In the event of a security incident:</p>
      <ul>
        <li>We will investigate and contain the incident promptly.</li>
        <li>Affected users and institutions will be notified.</li>
        <li>We will take corrective measures to prevent recurrence.</li>
        <li>Audit logs will be preserved for post-incident analysis.</li>
      </ul>

      <h2 id="institutional">Institutional Responsibility</h2>
      <p>
        Educational institutions using PlaceFlow are responsible for:
      </p>
      <ul>
        <li>Managing user access and permissions within their institution.</li>
        <li>Ensuring that student data is collected with appropriate consent.</li>
        <li>Complying with applicable data protection laws in their jurisdiction.</li>
        <li>Configuring retention policies appropriate for their institutional needs.</li>
      </ul>

      <h2 id="contact">Contact</h2>
      <p>
        To report a security vulnerability or for security-related inquiries, contact us at{" "}
        <a href="mailto:security@placeflow.app">security@placeflow.app</a>.
      </p>
      <p className="text-zinc-600 text-xs mt-4">
        We use PGP for security-related communications. Our public key is available on request.
      </p>
    </LegalPage>
  );
}
