import Image from "next/image";

const FEATURES = [
  {
    icon: "/icons/secure.svg",
    title: "Secure payments",
    desc: "Trusted, encrypted, and safe for parents and schools alike.",
  },
  {
    icon: "/icons/stayontop.svg",
    title: "Stay on top of activities",
    desc: "Keep track of classes, events, and student progress effortlessly.",
  },
  {
    icon: "/icons/flexible.svg",
    title: "Flexible payment options",
    desc: "Cards, bank transfer, or mobile wallets for easy sending and receiving.",
  },
  {
    icon: "/icons/simplify.svg",
    title: "Simplify administration",
    desc: "Reduce paperwork and streamline school management efficiently.",
  },
];

export default function WhyChooseUs() {
  return (
    /**
     * Figma: W:1240, H:372 Hug, X:100 → px-25
     * Auto layout: vertical, Gap:41 → flex flex-col gap-10.25
     * Padding: 0, Corner radius: 0
     */
    <section className="w-full bg-white px-25 py-20">

      <div className="flex flex-col gap-10.25">

        <h2 className="text-center text-3xl font-bold text-text-heading">
          Why everyone chooses us every time
        </h2>

        {/*
          * Figma: 4 cards W:295 H:271, gap:20 (4×295 + 3×20 = 1240)
          * Card: p:19, gap:54 (icon→text), corner-radius:10, fill:#F3F3F3
          * Text block: X:19 Y:134 W:257 H:112 Gap:6
          * Icon = Y:134 − padding(19) − gap(54) = 61px tall
          */}
        <div className="grid grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex h-67.75 flex-col gap-13.5 rounded-[10px] bg-neutral-100 p-4.75"
            >
              <Image
                src={f.icon}
                alt={f.title}
                width={61}
                height={61}
                className="h-15.25 w-15.25 object-contain"
              />
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-medium leading-none text-text-heading">{f.title}</h3>
                <p className="text-xl font-light leading-6.5 tracking-normal text-text-body">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
