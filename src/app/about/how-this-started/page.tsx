import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SocialShare from '@/components/ui/SocialShare';
import { generateSEOMetadata } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'How Street Support Started',
    description: 'Street support makes it easier to help people facing homelessness. Here is how this started - the inspiring story behind our founding.',
    keywords: [
      'how it started',
      'street support history',
      'founding story',
      'homelessness charity origin',
      'viv slack',
      'street support network history'
    ],
    path: 'about/how-this-started',
    image: '/assets/img/how-this-started.jpg',
    imageAlt: 'How Street Support Started'
  });
}

export default function HowThisStartedPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { label: "How this started", current: true }
        ]} 
      />

      {/* Header */}
      <section className="bg-brand-i py-12">
        <div className="content-container">
          <h1 className="heading-1 text-white">How Street Support Started</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing">
        <div className="content-container">
          <div className="prose-content max-w-none">
            <div className="space-y-8">
              
              {/* Hero Image */}
              <div className="relative w-full max-w-4xl mx-auto mb-8">
                <Image
                  src="/assets/img/how-this-started.jpg"
                  alt="How Street Support started - the inspiring story behind our founding"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-lg shadow-lg"
                  priority
                />
              </div>

              <div className="space-y-6">
                <p className="text-body">
                  One morning in September 2016, I plucked up the courage to speak to a man experiencing homelessness that I saw regularly in Prestwich. That conversation was the spark that led to Street Support Network.
                </p>

                <p className="text-body">
                  Like many of us, I'd noticed an increasing number of people facing homelessness on the streets. I felt really sad and frustrated that in a country like the UK people could find themselves without somewhere safe to sleep.
                </p>

                <p className="text-body">
                  Knowing that charities advise against giving cash, I wasn't sure what I could do to help. I would often offer to buy people I saw a coffee or something to eat, but beyond that I felt helpless. Donating to a national homelessness charity made sense, but it felt so distant and intangible.
                </p>

                <p className="text-body">
                  There was a young guy I had seen locally a few times, but never knew what to say. For some reason this particular day was different. I got over my fear and made myself ask him a few gentle questions – if he was cold, where he stayed at night, how he ended up there. He was pragmatic, just told me how it was, without a complaint. It blew me away. I regret that I didn't ask his name.
                </p>

                <p className="text-body">
                  He had been made redundant a few months before, paid his rent until his savings ran out, and was then evicted (I found out later this is now the number 1 cause of homelessness in the UK). Without a fixed address he couldn't access benefits or get a job, and was on a 9 month waiting list for housing. As a young single male he was at the bottom of the list for temporary accommodation. I was shocked to find out that most shelters had closed, and most of the ones that are still open need to charge for a bed. Sometimes he would make enough money begging to pay for somewhere to sleep, but more often he wouldn't.
                </p>

                <p className="text-body">
                  There was literally nothing I could say. I felt helpless, and I can only assume that is how he felt too, but a hundred times more so.
                </p>

                <p className="text-body">
                  It really affected me. I couldn't stop thinking about it. I sat with my partner trying to think of something we could do, and had lots of conversations on social media trying to come up with ideas. <a href="http://objectivesfirst.com/" className="text-brand-a hover:text-brand-b underline" target="_blank" rel="noopener noreferrer">Coming from a digital background</a> I was sure that technology could help somehow.
                </p>

                <p className="text-body">
                  I started to develop the concept of shelter vouchers that people could pay for through a mobile, and the person experiencing homelessness could redeem. It seemed to have real potential, and thankfully Gary Dunstan from <a href="http://doinggooddigital.com/" className="text-brand-a hover:text-brand-b underline" target="_blank" rel="noopener noreferrer">Doing Good Digital</a> agreed to partner with me to try and make this a success. We were fortunate that <a href="http://dotforge.com/" className="text-brand-a hover:text-brand-b underline" target="_blank" rel="noopener noreferrer">Dot Forge</a> felt the same, and when we applied for their social impact accelerator scheme, they decided to take a chance and support us in developing the idea.
                </p>

                <p className="text-body">
                  I felt we had something that could make a real difference, we even had a cool name 'SleepSafe', but once I started talking to experts and reading the research, I soon realised that with so few shelters it was problematic. It still encouraged a victim mentality, for the person experiencing homelessness to beg for help. It would make us feel better, but the next morning they would still be on the streets, still have other unmet needs, still be statistically much more likely to die young.
                </p>

                <p className="text-body">
                  I arranged to meet an experienced outreach worker called David, who has helped people facing homelessness for many years as a volunteer. Through conversations with him, our research, and spending time with some of the charities and voluntary groups, a bigger picture started to emerge. There were many amazing projects I knew nothing about, with different charities and voluntary groups providing a whole range of services. As the council budget cuts hit, and central services were reduced, compassionate individuals could use social media to start outreach projects and get other people on board. It was inspiring and confusing – I was really surprised that I hadn't heard so much of this was going on!
                </p>

                <div className="bg-brand-q p-6 rounded-lg my-8">
                  <p className="text-body mb-0">
                    Gary asked a key question. <span className="italic">"If you could do one thing to make the situation for people facing homelessness better, what would it be?"</span> David gave the answer that was the seed of Street Support – help the existing groups know what each other are doing, so they can coordinate, be more efficient, and help more people.
                  </p>
                </div>

                <p className="text-body">
                  All the research we found and the conversations we had had with other charities backed this up. The motivation and ideas were out there, but they weren't connected, coordinated or easily accessible from the outside.
                </p>

                <p className="text-body">
                  Many of us that care and want to help don't know how to get involved.
                </p>

                <p className="text-body">
                  Street Support Network was founded with the aim of removing these blockers. Primarily, we wanted to make it easy for someone experiencing homelessness to find help, relevant to their needs and location, through a mobile. Secondly, we wanted to make it easy to give help, by responding to specific things that local projects need, from money or volunteers, to clothes or food containers.
                </p>

                <p className="text-body">
                  So much has happened in that first few weeks. We were introduced to the Coalition of Relief (COR), comprising many of the grassroots groups in Manchester, and the wonderful Mikey, that coordinates their efforts with the council. We visited <a href="http://www.boothcentre.org.uk/" className="text-brand-a hover:text-brand-b underline" target="_blank" rel="noopener noreferrer">The Booth Centre</a> to find out about the work they do, and spoke to <a href="http://www.coffee4craig.com/" className="text-brand-a hover:text-brand-b underline" target="_blank" rel="noopener noreferrer">Coffee4Craig</a>, <a href="http://www.barnabus-manchester.org.uk/" className="text-brand-a hover:text-brand-b underline" target="_blank" rel="noopener noreferrer">Barnabus</a> and many more. All of them had the same response – yes we need this, please can we have it now!
                </p>

                <p className="text-body">
                  And now we have a team of talented digital experts making this happen: social researcher Kim Foale, one of my favourite developers <a href="https://twitter.com/vincelee888" className="text-brand-a hover:text-brand-b underline" target="_blank" rel="noopener noreferrer">Vince Lee</a>, talented designer <a href="https://twitter.com/alvislives" className="text-brand-a hover:text-brand-b underline" target="_blank" rel="noopener noreferrer">Alexander Atkinson</a>, UX developer <a href="https://twitter.com/frontendphil" className="text-brand-a hover:text-brand-b underline" target="_blank" rel="noopener noreferrer">Phil Lennon</a>, copywriter <a href="https://twitter.com/DaniJStyles" className="text-brand-a hover:text-brand-b underline" target="_blank" rel="noopener noreferrer">Danielle Styles</a> and more giving their time generously to guide us along the way.
                </p>

                <p className="text-body">
                  I'm so glad that I took the chance to have that conversation. I hope that one day I will get the chance to thank that man, and tell him about the Street Support Network that he inspired.
                </p>

                <p className="text-body">
                  I hope you will join in, follow and support us, and help people facing homelessness get the help they need.
                </p>

                <p className="text-body">
                  To find out more about our Viv, or to just say hello, please hop on over to her <a href="https://connectingwisdom.uk/" className="text-brand-a hover:text-brand-b underline" target="_blank" rel="noopener noreferrer">website</a> or <a href="https://www.linkedin.com/in/vivslack/" className="text-brand-a hover:text-brand-b underline" target="_blank" rel="noopener noreferrer">LinkedIn profile</a>.
                </p>

              </div>

            </div>
          </div>
          <SocialShare />
        </div>
      </section>
    </>
  );
}