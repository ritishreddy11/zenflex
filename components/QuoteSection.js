export default function QuoteSection() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-14 mb-24 text-center flex flex-col items-center justify-center">
      <blockquote className="text-3xl md:text-4xl font-serif text-brand font-semibold leading-snug mb-2" style={{letterSpacing: '0.01em'}}>
        “Breathe deeply. Move gently. Live mindfully.”
      </blockquote>
      <div className="w-28 h-1 bg-gradient-to-r from-transparent via-brand to-transparent rounded-full mt-6 mb-1 mx-auto" />
    </section>
  )
}
