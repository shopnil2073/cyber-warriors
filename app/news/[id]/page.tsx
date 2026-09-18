import Link from "next/link";

export async function generateStaticParams() {
  return [
    { id: "trc-training-drill" },
    { id: "trc-match-rules" },
    { id: "academy-welcomes-five" },
    { id: "anupam-satter-turzo" },
    { id: "strengthens-main-roster" },
    { id: "ucl-season-2-final-clash" },
  ];
}

export default async function SingleNewsPage(props: { params: any }) {
  const { id } = await props.params;

  const messiPic =
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] py-10 px-4 transition-colors duration-300 pb-20">
      <div className="max-w-4xl mx-auto bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 md:p-10 shadow-2xl">
        <div className="inline-block bg-[var(--bg-main)] border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-black px-3 py-1 rounded uppercase tracking-widest mb-4">
          TOURNAMENT UPDATE
        </div>

        <h1 className="text-2xl md:text-4xl font-black text-[var(--text-main)] tracking-tight uppercase leading-tight mb-4">
          TRC TRAINING DRILL ( ACADEMY )
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)] border-b border-[var(--border-color)] pb-6 mb-8">
          <span>By <strong className="text-[#D4AF37]">ADEEB KHANDAKER</strong></span>
          <span>•</span>
          <span>7:09 PM • AUG 17, 2026 (BST)</span>
          <span>•</span>
          <span>👁️ 84 Views</span>
        </div>

        <div className="relative h-64 md:h-96 w-full rounded-xl overflow-hidden mb-8 border border-[var(--border-color)]">
          <img
            src={messiPic}
            alt="News Cover"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4 text-xs md:text-sm leading-relaxed text-[var(--text-muted)] border-b border-[var(--border-color)] pb-8">
          <p>
            এই ট্রেইনিং ড্রিলে মোট ১০ জন সদস্য অংশগ্রহণ করবে। এই ড্রিলের পারফরম্যান্সের ওপর ট্রিপেল ড্রিলের পারফরম্যান্স মূল্যায়ন করা হবে।
          </p>
          <p>
            এই ড্রিলে অংশগ্রহণ বাধ্যতামূলক। সময়মতো যুক্ত হতে ব্যর্থ হলে দল থেকে সাময়িকভাবে বরখাস্ত করা হতে পারে।
          </p>
          <p>
            এই ড্রিলের সকল ম্যাচ COBEG-এর নিয়ম ও বিধিমালা অনুসরণ করে পরিচালিত হবে।
          </p>
        </div>

        <div className="py-6 border-b border-[var(--border-color)] flex flex-wrap justify-between items-center gap-4">
          <span className="text-xs font-black text-[#D4AF37] uppercase tracking-wider">
            SHARE THIS ARTICLE
          </span>
          <div className="flex items-center gap-2 text-xs">
            <button className="px-3 py-1.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded text-[var(--text-main)] font-bold hover:border-[#D4AF37]">
              f
            </button>
            <button className="px-3 py-1.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded text-[var(--text-main)] font-bold hover:border-[#D4AF37]">
              𝕏
            </button>
            <button className="px-3 py-1.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded text-[var(--text-main)] font-bold hover:border-[#D4AF37]">
              💬
            </button>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-sm font-black text-[var(--text-main)] uppercase tracking-wider mb-6">
            MORE FROM CYBER WARRIORS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/news" className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 hover:border-[#D4AF37] transition-all">
              <span className="text-[9px] text-[#D4AF37] font-bold">AUG 17, 2026</span>
              <h4 className="font-bold text-xs text-[var(--text-main)] mt-1 line-clamp-1 uppercase">
                TRC MATCH RULES & REGULATIONS
              </h4>
            </Link>
            <Link href="/news" className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 hover:border-[#D4AF37] transition-all">
              <span className="text-[9px] text-[#D4AF37] font-bold">AUG 02, 2026</span>
              <h4 className="font-bold text-xs text-[var(--text-main)] mt-1 line-clamp-1 uppercase">
                Academy Welcomes Five New Players to Roster
              </h4>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}