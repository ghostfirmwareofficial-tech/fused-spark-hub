import { useEffect } from "react";

const Privacy = () => {
  useEffect(() => {
    document.title = "Privacy Policy | Fused Up";
  }, []);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-6">Last updated: January 27, 2026</p>

        <div className="space-y-8 text-foreground/90">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              Welcome to Fused Up ("we," "our," or "us"). We are committed to protecting your privacy 
              and ensuring you understand how we collect, use, and safeguard your personal information 
              when you use our gaming community platform at fusedup.org.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="leading-relaxed mb-4">We collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Account Information:</strong> Email address, username, and profile details you provide during registration.</li>
              <li><strong>Gaming Accounts:</strong> When you link third-party gaming accounts (Epic Games, Discord, Steam, Riot Games), we collect your public gaming profile information and statistics.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our platform, including posts, comments, and tournament participation.</li>
              <li><strong>Device Information:</strong> Browser type, IP address, and device identifiers for security and analytics purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide and maintain our gaming community services</li>
              <li>Display your gaming statistics and achievements</li>
              <li>Enable social features like friend lists and team-ups</li>
              <li>Process tournament entries and distribute prizes</li>
              <li>Send important updates about your account or our services</li>
              <li>Improve and optimize our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
            <p className="leading-relaxed mb-4">
              We integrate with the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Epic Games:</strong> To retrieve your Fortnite statistics and verify your gaming identity.</li>
              <li><strong>Discord:</strong> For account linking and community features.</li>
              <li><strong>Stripe:</strong> For secure payment processing of tournament entries and purchases.</li>
            </ul>
            <p className="leading-relaxed mt-4">
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing</h2>
            <p className="leading-relaxed">
              We do not sell your personal information. We may share your information only in the 
              following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who assist in operating our platform (under strict confidentiality agreements)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures to protect your data, including 
              encryption, secure authentication, and regular security audits. However, no method 
              of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Disconnect linked gaming accounts at any time</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p className="leading-relaxed">
              Our services are not intended for users under 13 years of age. We do not knowingly 
              collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any 
              significant changes by posting the new policy on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this privacy policy or our data practices, please 
              contact us through our Discord community or via the contact options on our platform.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © 2026 Fused Up. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
