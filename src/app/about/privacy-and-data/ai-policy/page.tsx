import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SocialShare from '@/components/ui/SocialShare';

export default function AIPolicyPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About Street Support" },
          { href: "/about/privacy-and-data", label: "Privacy and Data" },
          { label: "AI Policy", current: true }
        ]} 
      />

      {/* Header */}
      <section className="bg-brand-i py-12">
        <div className="content-container">
          <h1 className="heading-1 text-white">Street Support Network AI Policy</h1>
        </div>
      </section>

      {/* Content */}
      <section className="section-spacing">
        <div className="content-container">
          <div className="prose-content max-w-none">
            <div className="space-y-12">
              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Introduction</h2>
                <p className="text-body mb-4">This policy sets out how Street Support Network uses artificial intelligence tools responsibly and effectively. It&apos;s designed for our team, trustees, partners, and anyone who wants to understand our approach to AI.</p>
                <p className="text-body mb-4">We&apos;ve been using AI across our organisation for over a year - from meeting transcription to our virtual assistant that connects people to local support. This policy captures what we&apos;ve learned about where AI helps and where human expertise is absolutely essential.</p>
                <p className="text-body">The goal is simple: give our team confidence to use AI safely and effectively, while protecting the people we serve and maintaining the trust we&apos;ve built.</p>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Quick Reference</h2>
                
                <h3 className="heading-3 mb-4 text-brand-l">Our Approach in Five Points</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-brand-e pl-6">
                    <h4 className="heading-4 mb-2 text-brand-l">1. Human-led, AI-supported</h4>
                    <p className="text-body">We use AI to save time on routine tasks — never to replace human insight or relationships.</p>
                  </div>
                  <div className="border-l-4 border-brand-e pl-6">
                    <h4 className="heading-4 mb-2 text-brand-l">2. Fix before you speed</h4>
                    <p className="text-body">We audit the process first. No point making a broken system faster.</p>
                  </div>
                  <div className="border-l-4 border-brand-e pl-6">
                    <h4 className="heading-4 mb-2 text-brand-l">3. Be strategic, not just curious</h4>
                    <p className="text-body">We ask &quot;Should we?&quot; before &quot;Can we?&quot;</p>
                  </div>
                  <div className="border-l-4 border-brand-e pl-6">
                    <h4 className="heading-4 mb-2 text-brand-l">4. Personal data is off-limits</h4>
                    <p className="text-body">No identifiable info goes into consumer AI tools. Ever.</p>
                  </div>
                  <div className="border-l-4 border-brand-e pl-6">
                    <h4 className="heading-4 mb-2 text-brand-l">5. Humans sign off</h4>
                    <p className="text-body">Everything gets a human check before use — except for our virtual assistant, which follows a different process.</p>
                  </div>
                </div>

                <h3 className="heading-3 mt-8 mb-4 text-brand-l">Traffic Light System</h3>
                
                <div className="space-y-6">
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                    <h4 className="font-semibold text-brand-l mb-3">Green Light — Go ahead (Safe to do without checking)</h4>
                    <ul className="list-disc pl-6 space-y-2 text-body">
                      <li>Internal drafts using public info</li>
                      <li>Research from public sources</li>
                      <li>Summarising internal meetings</li>
                      <li>Strategic thinking, planning, and brainstorming</li>
                      <li>Admin tasks with non-sensitive data</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
                    <h4 className="font-semibold text-brand-l mb-3">Amber Light — Check first (Get a second opinion)</h4>
                    <ul className="list-disc pl-6 space-y-2 text-body">
                      <li>External-facing content</li>
                      <li>Aggregated or anonymised data</li>
                      <li>New AI tools or features</li>
                      <li>Operating system or browser features that can capture or interpret on-screen content (for example Windows Copilot Vision, Windows Recall, or similar &quot;screen understanding&quot; tools). These must stay disabled unless the Managing Director confirms that no personal or sensitive data could be visible.</li>
                      <li>Anything that feels even slightly grey</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                    <h4 className="font-semibold text-brand-l mb-3">Red Light — Don&apos;t do it (Off-limits under this policy)</h4>
                    <ul className="list-disc pl-6 space-y-2 text-body">
                      <li>Real people&apos;s personal information</li>
                      <li>Financial data, passwords or access credentials</li>
                      <li>Sensitive or confidential internal material</li>
                      <li>Anything that could harm trust or safety</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 bg-brand-q p-6 rounded-lg">
                  <h4 className="heading-4 mb-3 text-brand-l">What We Never Do With AI</h4>
                  <ul className="list-disc pl-6 space-y-2 text-body">
                    <li>Use AI platforms to process personal data about people seeking support</li>
                    <li>Make decisions about individuals without human input</li>
                    <li>Replace human conversations, care, or direct support</li>
                    <li>Use AI to assess, triage, or respond to safeguarding concerns — any concerns about someone&apos;s safety must always go directly to a human</li>
                    <li>Let AI negotiate partnerships or service agreements</li>
                    <li>Rely on AI in emergencies or crisis situations</li>
                  </ul>
                </div>

                <div className="mt-8 bg-brand-q p-6 rounded-lg">
                  <h4 className="heading-4 mb-3 text-brand-l">Our Virtual Assistant (IBM WatsonX)</h4>
                  <ul className="list-disc pl-6 space-y-2 text-body">
                    <li>Gives real-time recommendations about local homelessness services</li>
                    <li>Pulls only from verified, regularly updated services</li>
                    <li>Doesn&apos;t store or collect personal data</li>
                    <li>Always recommends local organisations that provide broader human advice beyond Housing Options</li>
                    <li>Reviewed monthly for accuracy and tone</li>
                  </ul>
                </div>

                <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                  <h4 className="heading-4 mb-3 text-brand-l">Not Sure? Ask.</h4>
                  <p className="text-body mb-3">Contact the Managing Director right away for:</p>
                  <ul className="list-disc pl-6 space-y-2 text-body">
                    <li>Anything involving personal data</li>
                    <li>A new tool or use case</li>
                    <li>Uncertainty about AI-generated content</li>
                    <li>Any incident or concern</li>
                  </ul>
                  <p className="text-body mt-4">👉 We&apos;d always rather hear a &quot;quick check&quot; question than fix a preventable mistake later.</p>
                </div>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Executive Summary</h2>
                <p className="text-body mb-4">We use AI to support our people, not replace them. This policy sets out how we use AI in line with our values of compassion, collaboration and practical support. It&apos;s here to give our team confidence, so we can experiment and innovate safely, knowing where the boundaries are.</p>
                
                <h3 className="heading-3 mb-4 text-brand-l">What this policy does:</h3>
                <ul className="list-disc pl-6 space-y-2 text-body mb-6">
                  <li>Sets clear principles for ethical AI use</li>
                  <li>Defines where human input is essential</li>
                  <li>Encourages safe experimentation</li>
                  <li>Protects people&apos;s personal information</li>
                  <li>Aligns with our strategy to build shared, digital-first infrastructure</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Who We Are and Why This Matters</h2>
                <p className="text-body mb-4">We&apos;re Street Support Network. We connect people seeking support to help, and help organisations work better together.</p>
                <p className="text-body">AI helps us do that more effectively, but only when it reflects our values, centres human connection, and protects people&apos;s dignity. This policy exists so our small team can use AI confidently, knowing what&apos;s okay, what&apos;s not, and why.</p>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Our Core Principles</h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-brand-e pl-6">
                    <h3 className="heading-4 mb-2 text-brand-l">1. Audit Before Automate</h3>
                    <p className="text-body">Speed doesn&apos;t help if the process is broken. Before using AI, we look at whether the task is actually working first.</p>
                  </div>
                  <div className="border-l-4 border-brand-e pl-6">
                    <h3 className="heading-4 mb-2 text-brand-l">2. Be Selective and Strategic</h3>
                    <p className="text-body">We don&apos;t use AI just because we can. For each use case, we ask: Should we use AI here?</p>
                  </div>
                  <div className="border-l-4 border-brand-e pl-6">
                    <h3 className="heading-4 mb-2 text-brand-l">3. Preserve Human Expertise Where It Matters</h3>
                    <p className="text-body">Some things require lived experience, emotional intelligence, or ethical judgement. AI can support, but never replace, these areas.</p>
                  </div>
                  <div className="border-l-4 border-brand-e pl-6">
                    <h3 className="heading-4 mb-2 text-brand-l">4. Protect Personal Information</h3>
                    <p className="text-body">No identifiable information goes into public AI tools. That includes names, case notes, contact details or anything that could identify someone seeking support.</p>
                  </div>
                  <div className="border-l-4 border-brand-e pl-6">
                    <h3 className="heading-4 mb-2 text-brand-l">5. Human Review of AI Outputs</h3>
                    <p className="text-body">Everything AI generates is reviewed by a human before it&apos;s shared externally — except for our virtual assistant, which has built-in safeguards and oversight.</p>
                  </div>
                  <div className="border-l-4 border-brand-e pl-6">
                    <h3 className="heading-4 mb-2 text-brand-l">6. Lead With Human Value, Not AI Capability</h3>
                    <p className="text-body">We don&apos;t brag about using AI. We say: &quot;Our people make this work. AI just helps us do more of what matters.&quot;</p>
                  </div>
                  <div className="border-l-4 border-brand-e pl-6">
                    <h3 className="heading-4 mb-2 text-brand-l">7. Grounded in IBM&apos;s Ethical AI Framework</h3>
                    <p className="text-body">Our approach draws on proven principles: explainability, fairness, robustness, transparency, and privacy. This isn&apos;t just good practice. It&apos;s how we build trust.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">What We Never Use AI For</h2>
                <p className="text-body mb-4">Clear boundaries protect everyone:</p>
                <ul className="list-disc pl-6 space-y-3 text-body">
                  <li>Processing personal data in consumer platforms</li>
                  <li>Making final decisions about individuals without human input</li>
                  <li>Replacing human conversations or direct support</li>
                  <li>AI must never be used to assess, triage, or respond to safeguarding concerns — any concerns about someone&apos;s safety must always go directly to a human</li>
                  <li>Negotiating partnerships or service agreements</li>
                  <li>Managing emergencies or crisis situations</li>
                  <li>Anything involving vulnerable groups without proper human review</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Where Human Expertise is Non-Negotiable</h2>
                <p className="text-body mb-4">These areas always require people, not machines:</p>
                <ul className="list-disc pl-6 space-y-3 text-body">
                  <li>Direct support conversations with people seeking support</li>
                  <li>Safeguarding decisions and risk assessments</li>
                  <li>Complex case work requiring understanding of individual circumstances</li>
                  <li>Crisis response and emergency situations</li>
                  <li>Partnership-building and relationship management</li>
                  <li>Strategic service decisions and board-level choices</li>
                  <li>Final approval of all public communications</li>
                  <li>Quality assurance for our virtual assistant responses</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Where AI Helps (With Oversight)</h2>
                <p className="text-body mb-4">AI adds value in these areas, but always with a human in the loop:</p>
                
                <h3 className="heading-3 mb-4 text-brand-l">Admin & Operations</h3>
                <ul className="list-disc pl-6 space-y-2 text-body mb-6">
                  <li>Calendar scheduling and meeting coordination</li>
                  <li>Meeting transcription and summaries</li>
                  <li>Data entry and basic reporting</li>
                  <li>Email and template drafts</li>
                </ul>

                <h3 className="heading-3 mb-4 text-brand-l">Content Creation</h3>
                <ul className="list-disc pl-6 space-y-2 text-body mb-6">
                  <li>Drafting policies and internal documents</li>
                  <li>Social media and blog content (reviewed against our tone of voice)</li>
                  <li>Funding bid first drafts (extensively edited by humans)</li>
                  <li>Newsletter and communication templates</li>
                </ul>

                <h3 className="heading-3 mb-4 text-brand-l">Analysis & Strategy</h3>
                <ul className="list-disc pl-6 space-y-2 text-body">
                  <li>Meeting analysis and action point extraction</li>
                  <li>Research and information summarisation</li>
                  <li>Trend spotting from aggregated data</li>
                  <li>Strategic planning support and thinking partnerships</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Virtual Assistant: Real-Time Help with Safeguards</h2>
                
                <div className="bg-brand-q p-6 rounded-lg mb-6">
                  <h3 className="heading-4 mb-3 text-brand-l">Virtual Assistant Overview:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-body">
                    <li><strong>Tool:</strong> IBM WatsonX</li>
                    <li><strong>Purpose:</strong> Real-time, localised service recommendations for people seeking support</li>
                    <li><strong>Governance:</strong> Regular human review, no personal data processed</li>
                    <li><strong>Human Support:</strong> Always recommends local organisations that provide broader advice beyond Housing Options</li>
                  </ul>
                </div>

                <p className="text-body mb-4">Given the higher-stakes nature of real-time advice, our virtual assistant follows different protocols:</p>
                <ul className="list-disc pl-6 space-y-3 text-body mb-4">
                  <li>Pulls from verified, regularly updated service databases</li>
                  <li>Doesn&apos;t collect or store personal information about users</li>
                  <li>Always includes recommendations to local organisations that provide broader human advice beyond Housing Options</li>
                  <li>Where such organisations don&apos;t exist locally, we work to establish them or temper AI expectations accordingly</li>
                  <li>Quarterly assessment of recommendation quality and human support pathways</li>
                  <li>Immediate incident reporting for concerning responses</li>
                </ul>
                <p className="text-body">Detailed governance framework for our Virtual Assistant is outlined in our AI Governance Plan, which follows IBM&apos;s five pillars of responsible AI</p>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Data, Email & Cloud Safeguards</h2>
                <p className="text-body mb-4">We&apos;ve made deliberate choices about AI access to our systems:</p>

                <h3 className="heading-3 mb-4 text-brand-l">Google Workspace Decision</h3>
                <p className="text-body mb-6">We&apos;ve disabled Google Workspace AI features (Smart Compose, Gemini) because they can access sensitive information across our email and file systems. This protects people seeking support from having their information processed by AI without their knowledge.</p>

                <h3 className="heading-3 mb-4 text-brand-l">Email and Cloud Connectors</h3>
                <p className="text-body mb-4">Consumer tools like ChatGPT, Claude or Gemini are great for drafting and ideas — but they&apos;re not safe places for anything involving real people&apos;s data.</p>
                <p className="text-body mb-3">Enterprise AI tools might be appropriate, but only after:</p>
                <ul className="list-disc pl-6 space-y-2 text-body mb-6">
                  <li>Auditing our existing data permissions</li>
                  <li>Understanding exactly what the tool can access</li>
                  <li>Securing proper data processing agreements</li>
                  <li>Getting Managing Director approval</li>
                </ul>

                <div className="bg-brand-q p-6 rounded-lg">
                  <h4 className="heading-4 mb-3 text-brand-l">The Key Principle</h4>
                  <p className="text-body">If someone has access to sensitive data they shouldn&apos;t, AI makes it searchable through natural conversation. We fix permissions first, then consider AI connections.</p>
                </div>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">GDPR Compliance</h2>
                <p className="text-body mb-4">Our no-personal-data approach automatically ensures GDPR compliance (see our Data Protection Policy for full details). If personal information accidentally gets into an AI tool, report immediately to the Managing Director and follow our existing data breach procedures.</p>
                <p className="text-body">All AI use must comply with GDPR requirements, particularly given our work with vulnerable populations. Personal data of people seeking support requires the highest protection standards. Full GDPR compliance procedures are detailed in our Data Protection Policy.</p>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Oversight & Quality Control</h2>
                
                <h3 className="heading-3 mb-4 text-brand-l">Human Review Process</h3>
                <ul className="list-disc pl-6 space-y-3 text-body mb-6">
                  <li>Everything AI produces gets reviewed before external use and follows our Information, Communication and Social Media Policy approval processes</li>
                  <li>We fact-check claims, align with our tone of voice, and check for bias</li>
                  <li>We review AI-generated content for warmth, clarity and sensitivity, because the way we speak can make a real difference to how safe and supported someone feels</li>
                  <li>Content must sound authentically like Street Support Network</li>
                  <li>All outputs must reflect our values and brand guidelines</li>
                </ul>

                <h3 className="heading-3 mb-4 text-brand-l">Virtual Assistant Monitoring</h3>
                <ul className="list-disc pl-6 space-y-2 text-body mb-6">
                  <li>Monthly review of user interactions and response quality</li>
                  <li>Quarterly assessment of service recommendations accuracy</li>
                  <li>Regular testing with known scenarios</li>
                  <li>Clear escalation pathways for concerning responses</li>
                </ul>

                <h3 className="heading-3 mb-4 text-brand-l">Governance Structure</h3>
                <ul className="list-disc pl-6 space-y-2 text-body">
                  <li>Managing Director oversees all AI use and policy implementation</li>
                  <li>Report any concerns directly to Managing Director</li>
                  <li>Monthly team check-ins about AI effectiveness and challenges</li>
                  <li>Annual policy review incorporating new learning and tools</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">How We Talk About AI</h2>
                <p className="text-body mb-4">We use a layered approach to transparency, based on research showing blanket &quot;created with AI&quot; disclosures can damage trust:</p>
                
                <div className="space-y-4">
                  <div className="bg-brand-q p-6 rounded-lg">
                    <h4 className="font-semibold text-brand-l mb-2">1. Organisation-wide (website, reports)</h4>
                    <p className="text-body">&quot;Our team&apos;s expertise drives everything we do. We use AI for drafting and admin tasks, so our people can focus on relationships, strategy, and direct support.&quot;</p>
                  </div>
                  <div className="bg-brand-q p-6 rounded-lg">
                    <h4 className="font-semibold text-brand-l mb-2">2. In Relationships (partners, funders)</h4>
                    <p className="text-body">We&apos;re open about our AI principles and safeguards when building partnerships — demonstrating thoughtfulness, not just disclosure.</p>
                  </div>
                  <div className="bg-brand-q p-6 rounded-lg">
                    <h4 className="font-semibold text-brand-l mb-2">3. Per Output (specific documents)</h4>
                    <p className="text-body">We disclose AI use only when legally required, relevant for verification, or directly asked.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Accessibility and Inclusion</h2>
                <p className="text-body mb-4">We commit to reviewing all AI-generated content for:</p>
                <ul className="list-disc pl-6 space-y-2 text-body mb-4">
                  <li>Plain language and cognitive accessibility</li>
                  <li>Inclusion and sensitivity of tone</li>
                  <li>Freedom from harmful assumptions or bias</li>
                  <li>Alignment with our values of dignity and respect</li>
                </ul>
                <p className="text-body">Our communications should always be easy to understand and welcoming to everyone.</p>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Incident Response</h2>
                <p className="text-body mb-4">If personal information gets put into an AI tool, or if there are concerns about AI use:</p>
                <ol className="list-decimal pl-6 space-y-2 text-body">
                  <li>Report immediately to the Managing Director</li>
                  <li>Document what happened — which tool, what information, when</li>
                  <li>Take action to limit potential impact</li>
                  <li>Follow our Data Protection Policy breach procedures if personal data is involved</li>
                  <li>Learn and improve — update guidance based on what happened</li>
                  <li>Support the person involved — no blame, we&apos;re all learning</li>
                </ol>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Training and Support</h2>
                
                <h3 className="heading-3 mb-4 text-brand-l">For New Team Members</h3>
                <ul className="list-disc pl-6 space-y-2 text-body mb-6">
                  <li>Clear AI guidance during induction</li>
                  <li>Examples of appropriate and inappropriate use</li>
                  <li>Connection to our tone of voice and brand guidelines</li>
                  <li>Ongoing support and mentoring</li>
                </ul>

                <h3 className="heading-3 mb-4 text-brand-l">Ongoing Development</h3>
                <ul className="list-disc pl-6 space-y-2 text-body">
                  <li>Monthly team discussions about emerging AI tools</li>
                  <li>Sharing what works (and what doesn&apos;t)</li>
                  <li>Learning from other organisations&apos; approaches</li>
                  <li>Regular updates as technology evolves</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Measuring Success</h2>
                <p className="text-body mb-4">We&apos;ll know this policy is working when:</p>
                <ul className="list-disc pl-6 space-y-2 text-body">
                  <li>Team feel confident using AI safely within clear boundaries</li>
                  <li>Routine tasks get done faster, freeing time for relationships</li>
                  <li>Our communications still sound authentically human</li>
                  <li>People seeking support receive better, more timely help</li>
                  <li>No incidents involving personal data</li>
                  <li>Our AI use consistently reflects our values</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Implementation Plan</h2>
                
                <h3 className="heading-3 mb-4 text-brand-l">Immediately:</h3>
                <ul className="list-disc pl-6 space-y-2 text-body mb-6">
                  <li>Share with all team members and include in team meeting discussion</li>
                  <li>Add to induction process and contractor briefings</li>
                  <li>Present summary to trustees for approval</li>
                </ul>

                <h3 className="heading-3 mb-4 text-brand-l">Ongoing:</h3>
                <ul className="list-disc pl-6 space-y-2 text-body">
                  <li>Monthly team reviews of AI use and effectiveness</li>
                  <li>Quarterly virtual assistant assessments</li>
                  <li>Annual policy review incorporating new learning</li>
                  <li>Regular incident response practice and team check-ins</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Questions and Support</h2>
                <p className="text-body mb-4">If you&apos;re unsure about anything, ask. We&apos;d rather have too many questions than one preventable mistake.</p>
                <p className="text-body mb-4">This policy is a living document that grows with our experience. It&apos;s here to protect people and enable innovation — not block it.</p>
                <p className="text-body mb-6 italic">This policy reflects our values of compassion, collaboration, and practical solutions. It aligns with our mission to connect people to help and help organisations work better together.</p>
                
                <div className="mt-8">
                  <p className="text-body font-semibold">Version 2.0 — October 2025</p>
                  <p className="text-body text-brand-f">Next review: October 2026</p>
                </div>
              </section>
            </div>
          </div>
          <SocialShare />
        </div>
      </section>
    </>
  );
}
