import LegalPage from "@/components/legal/LegalPage";

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "student-information", label: "Student Information" },
  { id: "recruiter-information", label: "Recruiter Information" },
  { id: "usage-information", label: "Usage Information" },
  { id: "how-we-use-information", label: "How We Use Information" },
  { id: "data-access", label: "Data Access" },
  { id: "security", label: "Data Storage & Security" },
  { id: "data-retention", label: "Data Retention" },
  { id: "third-parties", label: "Third-Party Services" },
  { id: "user-rights", label: "User Rights" },
  { id: "cookies", label: "Cookies" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How PlaceFlow collects, uses, and protects your data."
      lastUpdated="May 2026"
      sections={sections}
    >
      <h2 id="introduction">Introduction</h2>
      <p>
        PlaceFlow (“we”, “our”, or “us”) provides software for managing campus placement operations, including student applications,
        recruiter workflows, interview coordination, and placement administration.
      </p>
      <p>
        This Privacy Policy explains what information we collect, how we use it, and the choices available to users and institutions using the platform.
      </p>
      <p>By using PlaceFlow, you agree to the practices described in this policy.</p>

      <h2 id="student-information">Student Information</h2>
      <p>Institutions using PlaceFlow may upload or manage student-related information including:</p>
      <ul>
        <li>Full name</li>
        <li>Email address</li>
        <li>Academic details</li>
        <li>Branch and graduation year</li>
        <li>CGPA and eligibility information</li>
        <li>Resume and uploaded documents</li>
        <li>Placement application history</li>
      </ul>

      <h2 id="recruiter-information">Recruiter Information</h2>
      <p>We may collect recruiter and company-related information including:</p>
      <ul>
        <li>Recruiter name</li>
        <li>Company name</li>
        <li>Work email</li>
        <li>Hiring workflows and interview schedules</li>
      </ul>

      <h2 id="usage-information">Usage Information</h2>
      <p>We automatically collect limited technical and operational information such as:</p>
      <ul>
        <li>Device and browser type</li>
        <li>Login activity</li>
        <li>IP address</li>
        <li>Session timestamps</li>
        <li>Interaction logs and workflow activity</li>
      </ul>

      <h2 id="how-we-use-information">How We Use Information</h2>
      <p>We use collected information to:</p>
      <ul>
        <li>Manage placement workflows</li>
        <li>Process applications and eligibility checks</li>
        <li>Coordinate interviews and recruiter activities</li>
        <li>Improve platform reliability and performance</li>
        <li>Maintain audit logs and operational history</li>
        <li>Provide support and platform updates</li>
        <li>Protect platform security and prevent misuse</li>
      </ul>
      <p>We do not sell personal information to advertisers or third parties.</p>

      <h2 id="data-access">Data Access and Visibility</h2>
      <p>Access to information is restricted based on platform roles.</p>
      <p>For example:</p>
      <ul>
        <li>Students can access their own application data</li>
        <li>Recruiters can access authorized candidate information</li>
        <li>Placement administrators can manage institutional workflows</li>
      </ul>
      <p>Institutions remain responsible for determining authorized platform access.</p>

      <h2 id="security">Data Storage and Security</h2>
      <p>We use industry-standard measures to protect stored information, including:</p>
      <ul>
        <li>Encrypted connections (HTTPS)</li>
        <li>Access controls and authentication</li>
        <li>Secure infrastructure providers</li>
        <li>Activity logging and monitoring</li>
      </ul>
      <p>While we work to protect information, no platform can guarantee absolute security.</p>

      <h2 id="data-retention">Data Retention</h2>
      <p>Information may be retained:</p>
      <ul>
        <li>while institutional accounts remain active</li>
        <li>for operational history and audit purposes</li>
        <li>to comply with legal or institutional obligations</li>
      </ul>
      <p>Institutions may request deletion of data subject to operational or legal requirements.</p>

      <h2 id="third-parties">Third-Party Services</h2>
      <p>PlaceFlow may use trusted third-party services for:</p>
      <ul>
        <li>hosting infrastructure</li>
        <li>authentication</li>
        <li>analytics</li>
        <li>file storage</li>
        <li>email delivery</li>
      </ul>
      <p>These providers process information only as necessary to support platform functionality.</p>

      <h2 id="user-rights">User Rights</h2>
      <p>Depending on applicable laws or institutional policies, users may request:</p>
      <ul>
        <li>access to their information</li>
        <li>correction of inaccurate information</li>
        <li>deletion of certain records</li>
        <li>export of available data</li>
      </ul>
      <p>Requests should be directed through the relevant institution or placement office where applicable.</p>

      <h2 id="cookies">Cookies and Session Data</h2>
      <p>PlaceFlow may use cookies or similar technologies to:</p>
      <ul>
        <li>maintain sessions</li>
        <li>improve usability</li>
        <li>support authentication</li>
        <li>understand platform performance</li>
      </ul>
      <p>Users may disable cookies through browser settings, though some functionality may be affected.</p>

      <h2 id="changes">Changes to This Policy</h2>
      <p>We may update this Privacy Policy periodically.</p>
      <p>When material changes occur, we will update the “Last updated” date and may notify users through the platform.</p>

      <h2 id="contact">Contact</h2>
      <p>
        For questions regarding this Privacy Policy or data handling practices, contact:
        <a href="mailto:support@placeflow.app">support@placeflow.app</a>
      </p>
    </LegalPage>
  );
}
