import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { BreadcrumbSchema } from '../components/StructuredData'

export default function Contact() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  const message = encodeURIComponent('Hi, I would like to know more about your courses. My name:')
  const waLink = `https://wa.me/${phone.replace(/\+/g,'')}?text=${message}`

  return (
    <>
      <SEOHead 
        title="Contact Us - ZenFlex Wellness"
        description="Get in touch with ZenFlex for yoga classes, wellness coaching, and mindful living guidance. Email, WhatsApp, and Instagram contact options available."
        keywords="contact ZenFlex, yoga instructor contact, wellness coach, support, customer service, WhatsApp yoga"
        url="/contact"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Contact Us", url: "/contact" }
      ]} />
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-serif mb-6 text-brown-900">Contact Us</h1>
        <p className="mb-3 text-brown-700">We’re here to support your wellness journey.</p>
        <p className="mb-6 text-brown-700">If you have questions about our yoga sessions, wellness coaching, or online courses, feel free to reach out using the contact details below.<br/>For detailed inquiries or registrations, you may be guided to a separate form when needed.</p>

        <h2 className="text-2xl font-serif mb-2 mt-4 text-brown-900 flex items-center">📞 Get in Touch</h2>
        <div className="mb-3 flex gap-6 items-center">
          <a href="https://wa.me/916360866107?text=Hi%20ZenFlex%2C%20I%20want%20to%20know%20more%20about%20the%20courses" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ZenFlex" className="inline-block">
            <img src="/whatsapp.svg" alt="WhatsApp Chat" width={36} height={36} style={{display:'inline-block',verticalAlign:'middle'}} />
          </a>
          <a href="https://www.instagram.com/zenflex_club?igsh=MTRoNWllN2pmd2Vncw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram ZenFlex" className="inline-block">
            <img src="/instagram.svg" alt="Instagram" width={36} height={36} style={{display:'inline-block',verticalAlign:'middle'}} />
          </a>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Email:</span>
            <span className="text-brown-800">support@zenflex.club</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Phone / WhatsApp:</span>
            <span className="text-brown-800">+91 63608 66107</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Availability:</span>
            <span className="text-brown-800">Online sessions available worldwide<br/>In-person sessions available by appointment only</span>
          </div>
        </div>

        <h2 className="text-2xl font-serif mb-2 mt-8 text-brown-900">🌸 Our Promise</h2>
        <ul className="list-disc pl-6 mb-3 text-brown-700">
          <li>Every interaction is treated with care, respect, and confidentiality.</li>
          <li>Your wellbeing and trust matter deeply to us.</li>
        </ul>

        <h2 className="text-3xl font-serif mb-6 text-brown-900">Privacy Policy</h2>
        <p className="mb-4 text-brown-700">At ZenFlex Wellness, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you interact with our website and services.</p>

        <ol className="list-decimal pl-6 mb-3 text-brown-700">
          <li className="mb-2"><b>Information We Collect</b><br/>
            We may collect the following information:
            <ul className="list-disc pl-6">
              <li>Name, email address, and phone number when you contact us directly</li>
              <li>Course enrollment and purchase details</li>
              <li>Basic website usage data such as cookies and analytics</li>
            </ul>
          </li>
          <li className="mb-2"><b>How We Use Your Information</b><br/>
            Your information may be used to:
            <ul className="list-disc pl-6">
              <li>Respond to inquiries and communications</li>
              <li>Provide yoga and wellness coaching services</li>
              <li>Process course enrollments</li>
              <li>Improve our website, content, and offerings</li>
              <li>Share important service-related updates (only when applicable)</li>
            </ul>
          </li>
          <li className="mb-2"><b>Health & Wellness Disclaimer</b><br/>
            Our yoga and wellness services are provided for educational and informational purposes only.<br/>
            They are not intended as medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before starting any new fitness, wellness, or lifestyle program.
          </li>
          <li className="mb-2"><b>Data Protection & Security</b><br/>
            We take reasonable steps to protect your personal information and ensure it is handled securely. We do not sell or misuse your personal data and only share it when required by law or trusted service providers.
          </li>
          <li className="mb-2"><b>Cookies & Analytics</b><br/>
            Our website may use cookies and analytics tools to:
            <ul className="list-disc pl-6">
              <li>Understand visitor behavior</li>
              <li>Improve website performance and experience</li>
            </ul>
            You can manage or disable cookies through your browser settings at any time.
          </li>
          <li className="mb-2"><b>Third-Party Services</b><br/>
            We may use third-party services such as website hosting platforms, payment gateways, and analytics tools. These services operate under their own privacy policies.
          </li>
          <li className="mb-2"><b>Policy Updates</b><br/>
            This Privacy Policy may be updated periodically. Any changes will be reflected on this page along with an updated effective date.
          </li>
          <li className="mb-2"><b>Contact Information</b><br/>
            For any questions related to this page or our privacy practices, please contact: <br/>
            <span className="underline">support@zenflex.club</span>
          </li>
        </ol>
        <p className="mb-2 text-brown-700">🌿 Thank you for choosing ZenFlex Wellness. We are honored to be part of your journey toward mindful living, balance, and holistic wellbeing.</p>
      </div>
    </Layout>
    </>
  )
}
