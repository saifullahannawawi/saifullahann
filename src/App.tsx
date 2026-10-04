import { useEffect, useMemo, useState } from "react";

type ProjectFilter = "semua" | "analisis" | "perencanaan";

type Project = {
  id: string;
  number: string;
  category: Exclude<ProjectFilter, "semua">;
  type: string;
  title: string;
  summary: string;
  focus: string;
  output: string;
};

const email = "saifullahannawawi@gmail.com";

const navigation = [
  { id: "tentang", label: "Tentang" },
  { id: "perjalanan", label: "Perjalanan" },
  { id: "karya", label: "Karya" },
  { id: "keahlian", label: "Keahlian" },
  { id: "kontak", label: "Kontak" },
];

const filterOptions: { id: ProjectFilter; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "analisis", label: "Analisis" },
  { id: "perencanaan", label: "Perencanaan" },
];

const projects: Project[] = [
  {
    id: "umkm",
    number: "01",
    category: "analisis",
    type: "Analisis bisnis",
    title: "Strategi Pemasaran UMKM Lokal",
    summary:
      "Riset sederhana untuk memahami cara sebuah usaha kecil menjangkau pelanggan, lalu menyusun rekomendasi yang relevan berdasarkan konsep manajemen.",
    focus:
      "Mengamati target pasar, pendekatan pemasaran, dan peluang perbaikan operasional.",
    output:
      "Laporan analisis singkat beserta rekomendasi strategi yang dapat dipertimbangkan.",
  },
  {
    id: "kuliner",
    number: "02",
    category: "perencanaan",
    type: "Perencanaan bisnis",
    title: "Rencana Usaha Kuliner Sehat",
    summary:
      "Merancang konsep usaha dari kebutuhan konsumen, kemudian menerjemahkannya menjadi arah produk dan gambaran operasional dasar.",
    focus:
      "Segmentasi, targeting, positioning, kebutuhan sumber daya, dan alur operasional.",
    output:
      "Rancangan awal business plan sebagai fondasi untuk mengembangkan ide usaha.",
  },
];

const skillGroups = [
  {
    number: "01",
    title: "Bisnis",
    status: "Fondasi",
    description:
      "Landasan yang diasah lewat perkuliahan dan tugas akademik.",
    skills: [
      "Riset pasar dasar",
      "Penyusunan proposal bisnis",
      "Pengolahan data & laporan dengan Microsoft Office",
    ],
  },
  {
    number: "02",
    title: "Teknologi & IT",
    status: "Bertumbuh",
    description:
      "Memperluas wawasan digital lewat kegiatan UKM IT kampus.",
    skills: [
      "Eksplorasi tools digital",
      "Belajar kolaboratif dalam komunitas IT",
      "Minat pada teknologi untuk kebutuhan bisnis",
    ],
  },
  {
    number: "03",
    title: "Cara bekerja",
    status: "Kekuatan",
    description:
      "Membawa rasa ingin tahu dan kemauan untuk terus berkembang.",
    skills: [
      "Kerja sama tim",
      "Presentasi & public speaking",
      "Berpikir kritis dan adaptif terhadap teknologi",
    ],
  },
];

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M5.5 14.5 14.5 5.5M6.5 5.5h8v8" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="m4.5 7.5 5.5 5 5.5-5" />
    </svg>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("semua");
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const visibleProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          activeFilter === "semua" || project.category === activeFilter,
      ),
    [activeFilter],
  );

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0,
      );
      setIsScrolled(window.scrollY > 28);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    updateScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>(".reveal");

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    revealItems.forEach((item) => {
      item.classList.add("will-reveal");
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("main section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-42% 0px -48% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <>
      <div
        className="scroll-progress"
        aria-hidden="true"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
        <a
          className="site-brand"
          href="#beranda"
          aria-label="Saifullah Annawawi Luqman, beranda"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-mark">SA</span>
          <span className="brand-name">
            Saifullah Annawawi Luqman
            <small>Portofolio personal</small>
          </span>
        </a>

        <button
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Tutup navigasi" : "Buka navigasi"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <nav
          className={`site-nav ${menuOpen ? "is-open" : ""}`}
          id="primary-navigation"
          aria-label="Navigasi utama"
        >
          {navigation.map((item, index) => (
            <a
              className={`nav-link ${activeSection === item.id ? "is-active" : ""}`}
              href={`#${item.id}`}
              key={item.id}
              onClick={() => setMenuOpen(false)}
              aria-current={activeSection === item.id ? "location" : undefined}
            >
              <span className="nav-index">0{index + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero" id="beranda" aria-labelledby="hero-title">
          <div className="hero-image" aria-hidden="true" />
          <div className="hero-shade" aria-hidden="true" />
          <div className="page-wrap hero-inner">
            <div className="hero-content">
              <p className="hero-kicker">
                <span className="live-dot" />
                Portofolio personal <span className="kicker-slash">/</span> Boyolali,
                Jawa Tengah
              </p>
              <h1 className="hero-name" id="hero-title">
                <span className="name-line">Saifullah</span>
                <span className="name-line">Annawawi</span>
                <span className="name-line">
                  Luqman<span className="name-period">.</span>
                </span>
              </h1>
              <div className="hero-bottom">
                <p className="hero-intro">
                  Mahasiswa Administrasi Bisnis yang tertarik menjembatani
                  strategi bisnis dan teknologi.
                </p>
                <div className="hero-actions">
                  <a className="button button-lime" href="#karya">
                    Jelajahi karya <ArrowUpRight />
                  </a>
                  <a className="button button-quiet" href="#kontak">
                    Hubungi saya <span className="button-rule" />
                  </a>
                </div>
              </div>
            </div>
            <a className="hero-scroll" href="#tentang" aria-label="Gulir ke tentang saya">
              <span className="scroll-stem" />
              <span>Gulir untuk menjelajah</span>
            </a>
          </div>
        </section>

        <section className="about-section" id="tentang" aria-labelledby="about-title">
          <div className="page-wrap">
            <div className="about-heading reveal">
              <div className="section-label">
                <span>01</span>
                <span className="label-line" />
                <span>Tentang saya</span>
              </div>
              <h2 className="section-title" id="about-title">
                Berangkat dari <em>rasa ingin tahu.</em>
              </h2>
            </div>

            <div className="about-body reveal">
              <p className="about-lead">
                Saya mahasiswa semester 2 S1 Administrasi Bisnis yang berdomisili
                di Boyolali, Jawa Tengah.
              </p>
              <div className="about-detail">
                <p>
                  Saya tertarik pada manajemen, strategi bisnis, dan teknologi.
                  Lewat perkuliahan dan UKM IT kampus, saya membangun pemahaman
                  bisnis sekaligus mengasah keterampilan digital.
                </p>
                <p>
                  Saya ingin terus belajar, bekerja bersama orang lain, dan
                  menjembatani kebutuhan bisnis dengan peluang yang dibuka oleh
                  teknologi.
                </p>
                <a className="text-link" href="#perjalanan">
                  Lihat perjalanan belajar <ArrowUpRight />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          className="journey-section"
          id="perjalanan"
          aria-labelledby="journey-title"
        >
          <div className="page-wrap">
            <div className="journey-heading reveal">
              <div className="section-label section-label-light">
                <span>02</span>
                <span className="label-line" />
                <span>Perjalanan belajar</span>
              </div>
              <div className="journey-intro">
                <h2 className="section-title" id="journey-title">
                  Fondasi yang sedang <em>dibangun.</em>
                </h2>
                <p>
                  Setiap pengalaman menjadi ruang untuk memahami bisnis dengan
                  lebih baik dan mencoba hal baru.
                </p>
              </div>
            </div>

            <div className="journey-list">
              <article className="journey-row reveal">
                <span className="journey-number">01</span>
                <div className="journey-main">
                  <h3>Pendidikan</h3>
                  <p className="journey-detail">
                    S1 Administrasi Bisnis <span>·</span> Perguruan Tinggi
                  </p>
                </div>
                <span className="journey-aside">Semester 2</span>
              </article>
              <article className="journey-row reveal">
                <span className="journey-number">02</span>
                <div className="journey-main">
                  <h3>Aktivitas kampus</h3>
                  <p className="journey-detail">
                    Anggota aktif Unit Kegiatan Mahasiswa (UKM) IT Kampus
                  </p>
                </div>
                <span className="journey-aside">Komunitas</span>
              </article>
              <article className="journey-row reveal">
                <span className="journey-number">03</span>
                <div className="journey-main">
                  <h3>Mata kuliah relevan</h3>
                  <p className="journey-detail journey-courses">
                    Pengantar Bisnis <span>·</span> Pengantar Manajemen <span>·</span>{" "}
                    Ekonomi Mikro <span>·</span> Pengantar Akuntansi
                  </p>
                </div>
                <span className="journey-aside">Kurikulum</span>
              </article>
            </div>
          </div>
        </section>

        <section className="work-section" id="karya" aria-labelledby="work-title">
          <div className="page-wrap">
            <div className="work-heading reveal">
              <div className="section-label">
                <span>03</span>
                <span className="label-line" />
                <span>Proyek & tugas akademik</span>
              </div>
              <div className="work-intro">
                <h2 className="section-title" id="work-title">
                  Dari konsep menuju <em>rencana.</em>
                </h2>
                <p>
                  Latihan menerapkan teori ke pertanyaan nyata seputar pasar,
                  strategi, dan peluang usaha.
                </p>
              </div>
            </div>

            <div className="project-controls reveal">
              <span className="project-count">
                {String(visibleProjects.length).padStart(2, "0")} proyek
              </span>
              <div className="project-filters" aria-label="Filter proyek">
                {filterOptions.map((option) => (
                  <button
                    className={`filter-button ${activeFilter === option.id ? "is-active" : ""}`}
                    type="button"
                    key={option.id}
                    aria-pressed={activeFilter === option.id}
                    onClick={() => {
                      setActiveFilter(option.id);
                      setOpenProject(null);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="project-list" aria-live="polite">
              {visibleProjects.map((project) => {
                const isOpen = openProject === project.id;

                return (
                  <article className="project-item" key={project.id}>
                    <button
                      className={`project-trigger ${isOpen ? "is-open" : ""}`}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`project-details-${project.id}`}
                      onClick={() => setOpenProject(isOpen ? null : project.id)}
                    >
                      <span className="project-number">{project.number}</span>
                      <span className="project-type">{project.type}</span>
                      <span className="project-title">{project.title}</span>
                      <span className="project-toggle">
                        <ChevronDown />
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        className="project-details"
                        id={`project-details-${project.id}`}
                      >
                        <p className="project-summary">{project.summary}</p>
                        <div className="project-detail-column">
                          <span>Fokus</span>
                          <p>{project.focus}</p>
                        </div>
                        <div className="project-detail-column">
                          <span>Luaran</span>
                          <p>{project.output}</p>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
            <p className="project-footnote reveal">
              Rincian ini mengikuti contoh ruang lingkup tugas akademik dan
              dapat diperbarui sesuai proyek aktual.
            </p>
          </div>
        </section>

        <section
          className="skills-section"
          id="keahlian"
          aria-labelledby="skills-title"
        >
          <div className="page-wrap">
            <div className="skills-heading reveal">
              <div className="section-label">
                <span>04</span>
                <span className="label-line" />
                <span>Keahlian & keterampilan</span>
              </div>
              <div className="skills-intro">
                <h2 className="section-title" id="skills-title">
                  Selalu ada ruang untuk <em>bertumbuh.</em>
                </h2>
                <p>
                  Memadukan bekal bisnis, rasa ingin tahu pada teknologi, dan
                  kemauan untuk berkembang.
                </p>
              </div>
            </div>

            <div className="skills-grid">
              {skillGroups.map((group) => (
                <article className="skill-group reveal" key={group.number}>
                  <div className="skill-group-top">
                    <span className="skill-number">{group.number}</span>
                    <span className="skill-status">{group.status}</span>
                  </div>
                  <h3>{group.title}</h3>
                  <p className="skill-description">{group.description}</p>
                  <ul>
                    {group.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="kontak" aria-labelledby="contact-title">
          <div className="page-wrap">
            <div className="section-label section-label-light reveal">
              <span>05</span>
              <span className="label-line" />
              <span>Kontak</span>
            </div>
            <div className="contact-grid">
              <div className="contact-intro reveal">
                <h2 className="section-title" id="contact-title">
                  Mari mulai <em>percakapan.</em>
                </h2>
                <p>
                  Terbuka untuk kolaborasi, pengalaman baru, dan obrolan seputar
                  bisnis maupun teknologi.
                </p>
                <a className="button button-lime contact-cta" href={`mailto:${email}`}>
                  Kirim email <ArrowUpRight />
                </a>
              </div>

              <div className="contact-list reveal">
                <div className="contact-row">
                  <span className="contact-label">Email</span>
                  <div className="contact-value">
                    <a href={`mailto:${email}`}>{email}</a>
                    <button className="copy-button" type="button" onClick={copyEmail}>
                      {copied ? "Tersalin" : "Salin"}
                    </button>
                  </div>
                </div>
                <a
                  className="contact-row"
                  href="https://instagram.com/saifullahal_16"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contact-label">Instagram</span>
                  <span className="contact-value">
                    @saifullahal_16 <ArrowUpRight />
                  </span>
                </a>
                <a
                  className="contact-row"
                  href="https://wa.me/6285877732878"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contact-label">WhatsApp</span>
                  <span className="contact-value">
                    0858 7773 2878 <ArrowUpRight />
                  </span>
                </a>
                <span className="sr-only" aria-live="polite">
                  {copied ? "Alamat email berhasil disalin." : ""}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-wrap footer-inner">
          <span>© {new Date().getFullYear()} Saifullah Annawawi Luqman</span>
          <span className="footer-location">Boyolali, Jawa Tengah</span>
          <a href="#beranda" className="back-to-top">
            Kembali ke atas <span>↑</span>
          </a>
        </div>
      </footer>
    </>
  );
}