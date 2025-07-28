import Link from 'next/link';

export default function AIAndEnvironmentPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="mb-8 px-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-brand-l hover:text-brand-a">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-brand-f">/</span>
                <Link href="/about" className="text-brand-l hover:text-brand-a">
                  About Street Support
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-brand-f">/</span>
                <Link href="/about/privacy-and-data" className="text-brand-l hover:text-brand-a">
                  Privacy and Data
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-brand-f">/</span>
                <span className="text-brand-f">AI and Environmental Impact</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="bg-brand-i py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="heading-2 text-white">AI and Environmental Impact</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="prose max-w-none space-y-8">
        <section>
          <h2 className="heading-3 mb-4">Taking responsibility</h2>
          <p>We know that every tool we use has an environmental impact. That includes AI.</p>
          <p>This report is part of how we stay honest about that. It shows what the impact looks like right now, how we're using AI in a way that reflects our values, and what we're doing to keep our footprint low as we grow.</p>
        </section>

        <hr className="border-brand-q" />

        <section>
          <h2 className="heading-3 mb-4">How we're using AI</h2>
          <p>We use AI to help us get more done with less time. It helps with writing, planning, editing and supporting our partners across the network. Our volunteers use AI to check and improve service listings. Our Virtual Assistant uses it to guide people to the right help more easily.</p>
          <p>This means we can support more people in more places without needing a bigger team.</p>
          <p>We don't have a central office. On average, the energy, travel, and resources tied to one person working at a desk in an office, adds up to one to two tonnes of CO₂ emissions each year. Even factoring in home energy use, working remotely keeps our overall footprint much smaller.</p>
          <p>We also benefit from the improvements OpenAI, IBM and others are making to reduce the energy use and emissions of the tools we rely on. For further information see:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><a href="https://sustainabilitylinkedin.com/openais-path-to-sustainable-innovation-a-comprehensive-report/?utm_source=chatgpt.com" className="text-brand-a hover:text-brand-b underline">OpenAI's Path to Sustainable Innovation: A Comprehensive Report - Sustainability LinkedIn</a></li>
            <li><a href="https://www.macro4.com/blog/six-ways-ibm-is-making-artificial-intelligence-more-sustainable/?utm_source=chatgpt.com" className="text-brand-a hover:text-brand-b underline">Six ways IBM is incorporating sustainability into its AI</a></li>
          </ul>
          <p>This report focuses on AI, but we know it's not the whole picture. Things like digital systems, travel and events all play a part. We're committed to continue to review our wider impact as we grow.</p>
        </section>

        <hr className="border-brand-q" />

        <section>
          <h2 className="heading-3 mb-4">What we looked at</h2>
          <p>AI has two main processes: training and usage. Training is when the model is first created: it's a one-off process that uses a huge amount of energy and is handled entirely by providers like OpenAI. What we do is use the finished model. This part is called inference. It's what happens each time we run a prompt or power the Virtual Assistant.</p>
          <p>This report focuses on inference, because that's the part we control. Our estimates are based on guidance from sources like Stanford HAI, Hugging Face, and the UK Government's greenhouse gas conversion factors (see addendum on "Where our figures come from" on the last page).</p>
          <p>This is where we can take responsibility:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>AI use by the team, including one person using it for around five hours a day and others using it occasionally</li>
            <li>Volunteers using AI tools for a few hours each week to support listings</li>
            <li>Projected use of our Virtual Assistant, based on 20,000 users a year with around 10 messages per person</li>
          </ul>
        </section>

        <hr className="border-brand-q" />

        <section>
          <h2 className="heading-3 mb-4">What we found</h2>
          <h3 className="heading-5 mb-3">Internal and volunteer use:</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Estimated energy use: 15 to 30 kWh per month</li>
            <li>CO₂ equivalent: 7 to 14 kg per month</li>
          </ul>
          <p>That's roughly the same as:</p>
          <ul className="list-disc pl-6 space-y-1 mb-6">
            <li>Running a desktop computer for a full workday, every day of the month</li>
            <li>Charging a laptop every day for a month</li>
          </ul>
          <h3 className="heading-5 mb-3">Virtual Assistant:</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Estimated energy use: 20 kWh per year</li>
            <li>CO₂ equivalent: 4.6 kg per year</li>
          </ul>
          <p>That's roughly the same as:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Charging a laptop once a week for a year</li>
            <li>Running a desktop computer for a few hours each month</li>
          </ul>
        </section>

        <hr className="border-brand-q" />

        <section>
          <h2 className="heading-3 mb-4">Why we're sharing this</h2>
          <p>We're not trying to make our impact sound smaller than it is. We're being upfront about what it looks like, how we measured it, and the thinking behind the choices we're making.</p>
          <p>Yes, there's an impact. It's not huge, but it matters, as do the benefits. We're reaching more people, more efficiently, without losing the human side of what we do.</p>
          <p>We believe there's an opportunity here to lead by example. We want to show how AI can be used thoughtfully and responsibly in this kind of work. This report is one step in that direction.</p>
          <p>If you have any questions about this report or just want to chat about AI and environmental impact in general, please do not hesitate to get in touch with us on <a href="mailto:admin@streetsupport.net" className="text-brand-a hover:text-brand-b underline">admin@streetsupport.net</a>.</p>
        </section>

        <hr className="border-brand-q" />

        <section>
          <h2 className="heading-3 mb-4">Where our figures come from</h2>
          <p>To keep this report grounded in real data, we've drawn on trusted sources that help estimate the energy use and emissions of AI, as well as everyday comparisons.</p>
          <h3 className="heading-5 mb-3">For AI usage, we looked at:</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><a href="https://hai.stanford.edu/news/measuring-carbon-footprint-ai-models" className="text-brand-a hover:text-brand-b underline">Stanford HAI</a>: A widely cited report that breaks down the energy used in training vs. usage (inference) and gives a range of emissions per prompt on models like GPT-3.</li>
            <li><a href="https://arxiv.org/abs/1906.02243" className="text-brand-a hover:text-brand-b underline">Allen Institute for AI</a>: Research that compares the emissions from training large AI models to the lifetime use of several cars. It helps put scale into perspective, even though our focus is on usage, not training.</li>
            <li><a href="https://openai.com/research/gpt-4" className="text-brand-a hover:text-brand-b underline">OpenAI GPT-4 Technical Report</a>: Highlights efficiency improvements in newer models, though it doesn't include specific carbon figures.</li>
            <li><a href="https://huggingface.co/blog/sasha/ai-environment-primer" className="text-brand-a hover:text-brand-b underline">Hugging Face + Carnegie Mellon</a>: Tracks real-time emissions from AI model use and provides open-source tools to estimate emissions from inference at scale.</li>
          </ul>
          <p className="italic mt-4">Last updated: 13 May 2025</p>
        </section>
        </div>
      </div>
    </>
  );
}