import LegalPage from "@/components/legal/LegalPage";

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "data-collection", label: "Data Collection" },
  { id: "use-of-information", label: "Use of Information" },
  { id: "data-sharing", label: "Data Sharing" },
  { id: "cookies", label: "Cookies" },
  { id: "data-retention", label: "Data Retention" },
  { id: "security", label: "Security" },
  { id: "user-rights", label: "User Rights" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How PlaceFlow collects, uses, and protects your data."
      lastUpdated="May 25, 2026"
      sections={sections}
    >
      <h2 id="introduction">Introduction</h2>
      <p>
        PlaceFlow ("we", "our", "the platform") is a placement management system designed for educational institutions.
        This Privacy Policy explains how we handle personal data when you use our platform.
      </p>
      <p>
        We take data protection seriously. PlaceFlow is built on the principle that your data belongs to you.
        We process only what is necessary to make placement operations work effectively.
      </p>

      <h2 id="data-collection">Data We Collect</h2>
      <p>We collect data that is necessary for placement coordination:</p>
      <ul>
        <li><strong>Student Data:</strong> Full name, institutional email, department, CGPA, academic records relevant to placement eligibility.</li>
        <li><strong>Recruiter Data:</strong> Company name, contact information, role details, interview schedules.</li>
        <li><strong>Placement Officer Data:</strong> Name, email, role within the placement cell.</li>
        <li><strong>Usage Data:</strong> Page interactions, feature usage, session information for improving the platform.</li>
        <li><strong>Uploaded Documents:</strong> Resumes, offer letters, and other documents shared during the placement process.</li>
      </ul>
      <p>We do not collect sensitive personal data beyond what is required for placement operations.</p>

      <h2 id="use-of-information">How We Use Your Information</h2>
      <p>Your data is used exclusively for placement-related operations:</p>
      <ul>
        <li>Facilitating student applications to placement drives.</li>
        <li>Managing interview scheduling and recruitment workflows.</li>
        <li>Generating analytics and reports for institutional planning.</li>
        <li>Communicating placement-related updates and notifications.</li>
        <li>Improving platform functionality and user experience.</li>
      </ul>
      <p>We do not use your data for advertising, profiling, or any purpose unrelated to placement operations.</p>

      <h2 id="data-sharing">Data Sharing</h2>
      <p>Your data is shared only within the scope of placement operations:</p>
      <ul>
        <li><strong>Students:</strong> Your profile and application data is shared with recruiters you apply to.</li>
        <li><strong>Recruiters:</strong> Access only the data of students who apply to their drives.</li>
        <li><strong>Institutions:</strong> Placement officers can view data within their institution.</li>
        <li><strong>Third Parties:</strong> We do not sell your data. We may use infrastructure providers (cloud hosting, database) who are bound by data processing agreements.</li>
      </ul>
      <p>Resumes belong to students. Institutions control placement workflows. Recruiters access only authorized data.</p>

      <h2 id="cookies">Cookies</h2>
      <p>We use only essential cookies required for authentication and session management:</p>
      <ul>
        <li><strong>Session Tokens:</strong> JWT-based authentication tokens stored in local storage.</li>
        <li><strong>Functional Cookies:</strong> Used for remembering user preferences and session state.</li>
      </ul>
      <p>We do not use tracking cookies, advertising cookies, or third-party analytics cookies.</p>

      <h2 id="data-retention">Data Retention</h2>
      <p>We retain your data only as long as necessary:</p>
      <ul>
        <li><strong>Active Accounts:</strong> Data is retained while your account is active.</li>
        <li><strong>Archived Drives:</strong> Closed placement drives are archived but retained for institutional records.</li>
        <li><strong>Deleted Accounts:</strong> Data is deleted or anonymized within 30 days of account deletion request.</li>
        <li><strong>Audit Logs:</strong> Retained for compliance and operational review, typically 12 months.</li>
      </ul>

      <h2 id="security">Security</h2>
      <p>We implement industry-standard security measures:</p>
      <ul>
        <li>Passwords are hashed using bcrypt with salt.</li>
        <li>All API communication uses HTTPS encryption.</li>
        <li>JWT tokens with expiry for authenticated sessions.</li>
        <li>Database-level access controls and parameterized queries.</li>
        <li>Role-based access control for students, officers, and recruiters.</li>
      </ul>

      <h2 id="user-rights">Your Rights</h2>
      <p>Depending on your jurisdiction, you may have the following rights:</p>
      <ul>
        <li><strong>Access:</strong> Request a copy of your personal data.</li>
        <li><strong>Correction:</strong> Update inaccurate or incomplete data.</li>
        <li><strong>Deletion:</strong> Request deletion of your account and associated data.</li>
        <li><strong>Portability:</strong> Export your data in a structured format.</li>
        <li><strong>Withdraw Consent:</strong> Stop specific data processing where applicable.</li>
      </ul>
      <p>To exercise these rights, contact your institutional placement office or reach out to us directly.</p>

      <h2 id="contact">Contact</h2>
      <p>
        For privacy-related inquiries, contact your institution&apos;s placement office or reach out to us at{" "}
        <a href="mailto:privacy@placeflow.app">privacy@placeflow.app</a>.
      </p>
    </LegalPage>
  );
}
