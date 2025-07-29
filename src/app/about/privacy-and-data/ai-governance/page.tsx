import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function AIGovernancePage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About Street Support" },
          { href: "/about/privacy-and-data", label: "Privacy and Data" },
          { label: "AI Governance Plan", current: true }
        ]} 
      />

      {/* Header */}
      <section className="bg-brand-i py-12">
        <div className="content-container">
          <h1 className="heading-1 text-white">AI Governance Plan</h1>
        </div>
      </section>

      {/* Content */}
      <section className="section-spacing">
        <div className="content-container">
          <div className="prose-content space-y-8">
        <section>
          <h2 className="heading-3 mb-4">Executive Summary</h2>
          <p>This AI Governance Plan outlines the principles and strategies to ensure the ethical, responsible, and secure integration of AI into our digital platform via IBM Watsonx Assistant. It is rooted in the five pillars of responsible AI: Fairness, Transparency, Accountability, Privacy, and Security. These principles guide our commitment to serving our beneficiaries with integrity, safeguarding user trust, and aligning our work with the charity's mission.</p>
        </section>

        <hr className="border-brand-q" />

        <section>
          <h2 className="heading-3 mb-4">Fairness</h2>
          <h5 className="heading-6 mb-3">What it Means</h5>
          <p>Fairness is about making sure our virtual assistant treats everyone equally and avoids bias. It means the system works well for all groups of people, no matter who they are. AI can even help us make fairer decisions by spotting and countering human biases.</p>
          <p>Bias happens when the system, or the data it's trained on, is unintentionally unfair. This can show up if the system reflects cultural or institutional prejudices, wasn't designed with enough care, or is used in ways no one planned for. Fairness also means thinking about diversity—like having a mix of voices on our team and listening to the people our service affects most.</p>
          <h5 className="heading-6 mb-3">Why it Matters</h5>
          <p>Fairness is at the heart of what we do as a charity. We want our services to be accessible and beneficial for everyone. Making sure the virtual assistant is fair helps us stick to our mission of equity and inclusion.</p>
          <h5 className="heading-6 mb-3">Risks to Watch Out For</h5>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Unfair Recommendations:</strong> The system might favour some users or organisations over others because of biases in the data.</li>
            <li><strong>Leaving People Out:</strong> If our data isn't complete, we might not serve some groups as well as we should.</li>
          </ul>
          <h5 className="heading-6 mb-3">How We're Tackling These Risks</h5>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Regular Data Checks:</strong> We'll keep checking the data we use to make sure it's balanced and fair.</li>
            <li><strong>Tools to Spot Bias:</strong> We'll use IBM Watsonx's tools to find and fix biases in the system.</li>
            <li><strong>Co-Production Approach:</strong> Actively involving a diverse group of stakeholders—including staff, beneficiaries, and underrepresented groups—during the design and implementation phases to ensure the system reflects the needs and perspectives of everyone it serves.</li>
          </ul>
        </section>

        <hr className="border-brand-q" />

        <section>
          <h2 className="heading-3 mb-4">Transparency</h2>
          <h5 className="heading-6 mb-3">What it Means</h5>
          <p>Transparency is about making sure everyone understands how the virtual assistant works and why it makes the recommendations it does. It's about being open—letting people see how the system operates, what it's good at, and where its limits are.</p>
          <p>When we're transparent, we build trust. This means being clear about what data we collect, how we use and store it, and who has access. Transparency also means explaining the purpose of the system and giving users the tools to understand how decisions are made.</p>
          <p>For example, technology companies should say who trained their AI systems, what data was used, and how the algorithms reach their conclusions. Sharing this kind of information helps users know if the system is right for their needs.</p>
          <h5 className="heading-6 mb-3">Why it Matters</h5>
          <p>Trust is essential in everything we do. Transparency helps our users, beneficiaries, and trustees feel confident in the virtual assistant and the decisions it makes.</p>
          <h5 className="heading-6 mb-3">Risks to Watch Out For</h5>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Hard-to-Understand Decisions:</strong> People might not trust the system if they can't see why certain recommendations were made.</li>
            <li><strong>Overpromising:</strong> If we exaggerate what the AI can do, it could damage trust when it doesn't meet expectations.</li>
          </ul>
          <h5 className="heading-6 mb-3">How We're Tackling These Risks</h5>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Explainability Tools:</strong> We'll use IBM Watsonx features to make sure the system's decisions are easy to understand.</li>
            <li><strong>Clear Communication:</strong> We'll provide straightforward guides and training so staff and users know how the system works.</li>
            <li><strong>Collaborative Feedback:</strong> Using co-production workshops to gather input from stakeholders on how the system operates and communicates its decisions. This ensures the assistant's processes are clear and meaningful for its users.</li>
            <li><strong>Regular Updates:</strong> We'll keep trustees and stakeholders in the loop with regular reports on how the virtual assistant is performing and what feedback we're getting.</li>
          </ul>
        </section>

        <hr className="border-brand-q" />

        <section>
          <h2 className="heading-3 mb-4">Explainability</h2>
          <h5 className="heading-6 mb-3">What it Means</h5>
          <p>Explainability is about making sure the virtual assistant can clearly show how and why it makes its recommendations. It's not enough for the system to work—it needs to be understandable.</p>
          <p>An explainable system lets people see what went into its decisions, like what data it used and how confident it is in its answers. It means being able to explain things in simple, non-technical terms, so even someone without a technical background can understand how it works.</p>
          <p>If a system has a big impact on someone's life, it's even more important to explain its reasoning. This might include sharing things like confidence levels, how consistent the system's decisions are, or how often errors happen. A system that hides its workings isn't trustworthy; transparency is key to building trust.</p>
          <h5 className="heading-6 mb-3">Why it Matters</h5>
          <p>Explainability helps users, staff, and trustees trust the system. When people understand how the virtual assistant works, they're more likely to feel confident using it. For our charity, this is essential to ensure the AI aligns with our values and serves our beneficiaries effectively.</p>
          <h5 className="heading-6 mb-3">Risks to Watch Out For</h5>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Black Box Decisions:</strong> If the system's decisions are too complex to explain, users and stakeholders may lose trust.</li>
            <li><strong>Misinterpretation:</strong> Poorly communicated explanations could lead users to misunderstand how the system works or misapply its recommendations.</li>
            <li><strong>Over-Simplification:</strong> Trying to make things too simple might gloss over important details that users need to know.</li>
          </ul>
          <h5 className="heading-6 mb-3">Actions to Support Explainability</h5>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>User-Friendly Design:</strong> Use IBM Watsonx's tools to make AI decisions easy to understand, even for non-technical users.</li>
            <li><strong>Clear Documentation:</strong> Provide straightforward guides that explain how the system works, what it's based on, and how accurate it is.</li>
            <li><strong>Regular Communication:</strong> Share updates with trustees and staff about the system's decisions, its accuracy, and any improvements being made.</li>
          </ul>
        </section>

        <hr className="border-brand-q" />

        <section>
          <h2 className="heading-3 mb-4">Privacy</h2>
          <h5 className="heading-6 mb-3">What it Means</h5>
          <p>Privacy is about keeping people's data safe and making sure we follow the rules, like GDPR. It means being upfront about what data we collect, why we're collecting it, how it's stored, and who can see it.</p>
          <p>We need to collect only the data that's absolutely necessary and make sure it's used for the purpose we said it would be. People should have control over their data, with clear and easy-to-use privacy settings.</p>
          <p>Protecting data also means using strong security practices, like encryption and limiting access to only those who need it.</p>
          <h5 className="heading-6 mb-3">Why it Matters</h5>
          <p>As a charity, trust is everything. Protecting people's sensitive information helps us maintain that trust and meet legal obligations like GDPR.</p>
          <h5 className="heading-6 mb-3">Risks to Watch Out For</h5>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Data Breaches:</strong> If the system is hacked or data isn't properly secured, sensitive information could be exposed.</li>
            <li><strong>Non-Compliance with GDPR:</strong> Not following legal requirements could lead to fines and damage to our reputation.</li>
            <li><strong>Over-Collection of Data:</strong> Collecting too much or unnecessary data could create privacy risks and undermine trust.</li>
          </ul>
          <h5 className="heading-6 mb-3">Actions to Support Privacy</h5>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Data Minimisation:</strong> We'll use IBM Watsonx tools to make sure we only collect the data we really need and store it securely. Personal data is only stored for the purpose of being able to demonstrate what led the system to make specific recommendations to an individual about organisations and what advice it gave along the way.</li>
            <li><strong>Data anonymisation:</strong> All data used for strategic and collaborative purposes within the context of partnerships and collaborations will be anonymised.</li>
            <li><strong>User Consent:</strong> We'll ask for clear consent from users before collecting or using their data.</li>
            <li><strong>Regular Privacy Checks:</strong> We'll run regular privacy impact assessments to spot and fix any risks.</li>
          </ul>
        </section>

        <hr className="border-brand-q" />

        <section>
          <h2 className="heading-3 mb-4">Robustness</h2>
          <h5 className="heading-6 mb-3">What it Means</h5>
          <p>Robustness is about making sure the virtual assistant is secure, reliable, and able to handle unexpected situations. This means protecting the system from cyberattacks, preventing unauthorised access, and ensuring it works as expected—even when things don't go as planned.</p>
          <p>Robust systems are built to deal with unusual inputs or malicious attempts to interfere, like someone trying to corrupt the training data. They're designed to keep running smoothly and safely, giving users confidence in their outcomes.</p>
          <h5 className="heading-6 mb-3">Why it Matters</h5>
          <p>If the virtual assistant isn't secure, it could lead to data breaches, technical failures, or even harmful decisions. Strong protections are vital to safeguard sensitive information, maintain trust, and keep the system running without interruptions.</p>
          <h5 className="heading-6 mb-3">Risks to Watch Out For</h5>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cyberattacks:</strong> Hackers might target the system or its database, risking exposure of sensitive information.</li>
            <li><strong>System Failures:</strong> Technical issues could lead to downtime, disrupt services and erode trust.</li>
            <li><strong>Data Poisoning:</strong> Malicious actors might try to tamper with training data to compromise the system.</li>
          </ul>
          <h5 className="heading-6 mb-3">Actions to Support Robustness</h5>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Data Encryption:</strong> We'll use IBM Watsonx's tools to encrypt data both at rest and during transmission.</li>
            <li><strong>Access Control:</strong> We'll limit system access to authorized personnel only, using role-based permissions.</li>
            <li><strong>Incident Response:</strong> We'll create and regularly test a response plan to handle breaches or technical failures quickly and effectively.</li>
          </ul>
          <p className="italic mt-4">Last updated: 2nd April 2025</p>
        </section>
          </div>
        </div>
      </section>
    </>
  );
}