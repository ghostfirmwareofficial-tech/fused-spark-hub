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
              and ensuring you understand how we collect, use, share, and retain your personal information 
              when you use our gaming community platform at fusedup.org.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Capture Your Data</h2>
            <p className="leading-relaxed mb-4">We capture data through the following methods:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Direct Input:</strong> Information you provide when creating an account, such as email address, username, and profile details.</li>
              <li><strong>Epic Games OAuth:</strong> When you connect your Epic Games account, we capture your Epic Games Account ID and display name through Epic Games' secure OAuth authentication flow. This is initiated when you click "Connect Epic Games" on your profile.</li>
              <li><strong>Fortnite Stats API:</strong> After you link your Epic Games account, we retrieve your public Fortnite statistics (wins, kills, matches played) from Fortnite's public API using your Epic Games Account ID.</li>
              <li><strong>Discord OAuth:</strong> When you connect Discord, we capture your Discord user ID and username through Discord's OAuth flow.</li>
              <li><strong>Automatic Collection:</strong> We automatically collect device information (browser type, IP address) and usage data when you interact with our platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
            <p className="leading-relaxed mb-4">We use your captured data for the following specific purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Stats Tracking During Tournaments:</strong> We use your Epic Games Account ID to fetch and track your Fortnite statistics (wins, kills) during tournament matches. This allows us to calculate tournament scores and determine placements.</li>
              <li><strong>Finding Friends:</strong> Your linked gaming accounts and profile information are used to help other Fused Up members find and connect with you for team-ups and friend requests within our platform.</li>
              <li><strong>Profile Display:</strong> Your gaming statistics, username, and avatar are displayed on your public profile so other community members can view your gaming achievements.</li>
              <li><strong>Tournament Participation:</strong> We use your Epic Games data to verify eligibility, track match performance, and process prize distributions for tournaments.</li>
              <li><strong>Community Features:</strong> Your data enables social features including team-up requests, friend lists, chat, and the community feed.</li>
              <li><strong>Account Authentication:</strong> We use your email and connected accounts to authenticate your identity and secure your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. How We Share Your Data</h2>
            <p className="leading-relaxed mb-4">We share your data in the following limited circumstances:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Public Profile Information:</strong> Your username, avatar, gaming statistics, and rank are visible to other Fused Up members to facilitate community interaction and friend-finding.</li>
              <li><strong>Tournament Leaderboards:</strong> During tournaments, participant usernames and scores are publicly displayed on leaderboards.</li>
              <li><strong>Payment Processing:</strong> When you make purchases or receive tournament prizes, we share necessary billing information with Stripe for secure payment processing.</li>
              <li><strong>Legal Requirements:</strong> We may share data if required by law, court order, or to protect our legal rights.</li>
            </ul>
            <p className="leading-relaxed mt-4 font-medium">
              We do NOT sell your personal information to third parties. We do NOT share your Epic Games credentials or private account data with anyone.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. How We Retain Your Data</h2>
            <p className="leading-relaxed mb-4">We retain your data according to the following schedule:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Account Data:</strong> Retained for as long as your account remains active. Upon account deletion request, we delete your personal data within 30 days.</li>
              <li><strong>Gaming Statistics:</strong> Your Fortnite stats are fetched fresh from the API when needed and cached temporarily. Historical tournament scores are retained indefinitely for leaderboard integrity.</li>
              <li><strong>Epic Games Connection:</strong> Your Epic Games Account ID is retained until you disconnect your Epic Games account or delete your Fused Up account.</li>
              <li><strong>Tournament Records:</strong> Tournament participation records (scores, placements, prizes) are retained indefinitely for historical reference and dispute resolution.</li>
              <li><strong>Chat Messages & Posts:</strong> User-generated content is retained until you delete it or request account deletion.</li>
              <li><strong>Usage Logs:</strong> Server logs and analytics data are retained for 90 days for security and debugging purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
            <p className="leading-relaxed mb-4">
              We integrate with the following third-party services, each with their own privacy policies:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Epic Games:</strong> We use Epic Games OAuth to authenticate your identity and access your public Fortnite statistics. See: <a href="https://www.epicgames.com/site/en-US/privacypolicy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Epic Games Privacy Policy</a></li>
              <li><strong>Discord:</strong> We use Discord OAuth for account linking and community features. See: <a href="https://discord.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Discord Privacy Policy</a></li>
              <li><strong>Stripe:</strong> We use Stripe for secure payment processing. See: <a href="https://stripe.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures to protect your data, including 
              encryption in transit (HTTPS/TLS), secure OAuth token handling, encrypted database storage, 
              and regular security audits. We never store your Epic Games password or login credentials—only 
              the OAuth tokens and account IDs necessary for our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Your Rights and Choices</h2>
            <p className="leading-relaxed mb-4">You have the following rights regarding your data:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of any inaccurate data.</li>
              <li><strong>Deletion:</strong> Request deletion of your account and all associated personal data.</li>
              <li><strong>Disconnect Accounts:</strong> Disconnect your Epic Games, Discord, or other linked accounts at any time from your profile settings.</li>
              <li><strong>Opt-Out:</strong> Opt out of non-essential communications.</li>
            </ul>
            <p className="leading-relaxed mt-4">
              To exercise any of these rights, contact us through Discord or use the account settings in your profile.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="leading-relaxed">
              Our services are not intended for users under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If we discover we have collected 
              data from a child under 13, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any 
              significant changes by posting the new policy on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="leading-relaxed mb-4">
              For any questions about this privacy policy, data protection inquiries, or to exercise your data rights, please contact us:
            </p>
            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
              <p><strong>Data Protection Contact:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Email:</strong> <a href="mailto:fusedupofficial@proton.me" className="text-primary hover:underline">fusedupofficial@proton.me</a></li>
                <li><strong>Website:</strong> <a href="https://fusedup.org" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">fusedup.org</a></li>
                <li><strong>Discord:</strong> Join our community server for direct support</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                We aim to respond to all data protection inquiries within 30 days.
              </p>
            </div>
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
