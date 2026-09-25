"use client";

export default function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1229] py-10 pb-28 text-[#C9D4F5] sm:pb-10">
      <div className="km-container">
        <img
          src="https://storage.helloreaddy.io/project_files/9bb86594-2c5f-46b8-bd7f-b7ec7098d2d5/0cb6167c-f2c4-4579-8d4c-616b5fe81bcb_compressed_ChatGPT-Image-Sep-24-2026-02_59_07-PM.webp"
          alt="Kameti Management Software by Digi India Solutions"
          className="h-12 w-auto object-contain sm:h-14"
        />

        <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[15px] text-[#8E9CC7]">
          <span>Sector 24, Rohini, Delhi</span>
          <span aria-hidden="true">|</span>
          <a href="tel:+918130543714" className="hover:text-white">
            +91 81305 43714
          </a>
          <span aria-hidden="true">|</span>
          <a
            href="https://digiindiasolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            digiindiasolutions.com
          </a>
          <span aria-hidden="true">|</span>
          <a href="/privacy" className="hover:text-white">
            Privacy Policy
          </a>
        </p>

        <p
          className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#8E9CC7]"
          style={{ opacity: 0.8 }}
        >
          KametiPro ek hisaab-kitaab aur record management software hai. Hum koi
          kameti, chit fund ya investment scheme nahi chalate. Kameti chalane se
          jude local niyam aur kanoon ka paalan organizer ki zimmedari hai.
        </p>

        <p className="mt-4 text-[15px] text-[#8E9CC7]">
          © {year} Digi India Solutions
        </p>
      </div>
    </footer>
  );
}