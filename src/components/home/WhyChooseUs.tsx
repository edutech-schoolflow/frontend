import Image from "next/image";

const FEATURES = [
  {
    icon: "/icons/secure.svg",
    title: "Secure payments",
    desc: "Encrypted and trusted. Every fee payment is protected end to end.",
  },
  {
    icon: "/icons/stayontop.svg",
    title: "Stay on top",
    desc: "Classes, events, and student progress — always in front of you.",
  },
  {
    icon: "/icons/flexible.svg",
    title: "Flexible payments",
    desc: "Cards, bank transfer, or mobile wallets. Parents choose what works.",
  },
  {
    icon: "/icons/simplify.svg",
    title: "Less admin work",
    desc: "Cut the paperwork. Run your school from a single dashboard.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-[#f7faf8] px-6 py-24 md:px-12 lg:px-20 xl:px-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-brand-green">
            Why us
          </p>
          <h2 className="mt-3 text-[42px] font-semibold leading-tight tracking-tight text-text-heading">
            Built to make your life easier
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-5 rounded-[12px] border border-border-default bg-white p-6"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-mint">
                <Image
                  src={f.icon}
                  alt={f.title}
                  width={22}
                  height={22}
                  className="h-[22px] w-[22px] object-contain"
                />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-text-heading">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-text-body">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
