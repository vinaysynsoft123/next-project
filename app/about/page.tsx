import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white">
      {/* HERO SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          About ShopEase
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-zinc-600 dark:text-zinc-400">
          ShopEase is a modern e-commerce platform built to deliver quality
          products, seamless shopping, and fast delivery — all in one place.
        </p>
      </section>

      {/* MISSION SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-semibold">Our Mission</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Our mission is to make online shopping simple, reliable, and
            enjoyable. We focus on providing carefully curated products,
            transparent pricing, and excellent customer support.
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Whether you’re shopping for electronics, fashion, or everyday
            essentials, ShopEase is here to serve you better.
          </p>
        </div>

        <div className="relative h-[350px] w-full">
          <Image
            src="/about/mission.png"
            alt="Our Mission"
            fill
            className="object-contain"
          />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: "Quality Products",
              desc: "We partner with trusted brands to bring you the best quality products.",
            },
            {
              title: "Fast Delivery",
              desc: "Quick and reliable delivery to your doorstep.",
            },
            {
              title: "Secure Payments",
              desc: "Your transactions are protected with industry-grade security.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-white dark:bg-zinc-900 p-8 shadow"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Happy Customers", value: "10K+" },
            { label: "Products", value: "500+" },
            { label: "Orders Delivered", value: "25K+" },
            { label: "Years of Trust", value: "5+" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-black dark:bg-white text-white dark:text-black py-16 text-center">
        <h2 className="text-3xl font-bold">
          Start Shopping With Confidence
        </h2>
        <p className="mt-4 text-lg">
          Join thousands of customers who trust ShopEase.
        </p>
        <a
          href="/products"
          className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-black hover:bg-zinc-200 dark:bg-black dark:text-white dark:hover:bg-zinc-800"
        >
          Browse Products
        </a>
      </section>
    </div>
  );
}
