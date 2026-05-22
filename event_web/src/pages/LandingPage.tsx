import { Link } from 'react-router-dom'
import { IMAGES } from '@/constants/images'
import { Logo } from '@/components/Logo'
import '@/styles/landing.css'

export function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container nav-container">
          <Logo />
          <nav>
            <ul className="nav-links">
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#values">Our Values</a>
              </li>
              <li>
                <a href="#platform">Event Platform</a>
              </li>
              <li>
                <a href="#marketplace">Marketplace</a>
              </li>
              <li>
                <Link to="/login">Sign In</Link>
              </li>
              <li>
                <Link to="/signup">Get Started</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section
          id="home"
          className="hero"
          style={{ backgroundImage: `url(${IMAGES.hero})` }}
        >
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1>Your Gateway to Traditional Celebrations</h1>
            <p>
              Utsav Connect is the premier event management platform and community
              marketplace dedicated to ensuring your Indian ceremonies are authentic,
              seamless, and beautifully executed.
            </p>
            <Link to="/signup" className="btn btn-placeholder">
              Get Started Free
            </Link>
          </div>
        </section>

        <section id="values" className="values-section section-padding">
          <div className="container">
            <div className="section-header">
              <h2>Our Core Values</h2>
            </div>
            <div className="values-grid">
              <div className="value-card">
                <i className="fa-solid fa-om value-icon" />
                <h3>Authenticity</h3>
                <p>
                  We honor the deep-rooted traditions of Indian ceremonies, ensuring every
                  ritual and celebration remains true to its cultural heritage.
                </p>
              </div>
              <div className="value-card">
                <i className="fa-solid fa-people-group value-icon" />
                <h3>Community</h3>
                <p>
                  We build bridges between hosts and local artisans, fostering a supportive
                  network that brings celebrations to life.
                </p>
              </div>
              <div className="value-card">
                <i className="fa-solid fa-star value-icon" />
                <h3>Excellence</h3>
                <p>
                  We are committed to delivering seamless experiences, maintaining the highest
                  standards for your most important life events.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="section-padding">
          <div className="container split-section">
            <div className="split-content">
              <h2>Event Management</h2>
              <p>
                At Utsav Connect, we understand that traditional Indian ceremonies are profound
                milestones. Our dedicated platform is designed to manage the intricacies of these
                sacred events.
              </p>
              <p>
                From the sacred vows to the joyful gatherings, we provide the structure and
                support needed to host celebrations that resonate with cultural depth and personal
                meaning.
              </p>
              <ul className="feature-list">
                <li>Expertise in Vivah Ceremonies</li>
                <li>Specialized Mundan Planning</li>
                <li>Seamless Event Coordination</li>
              </ul>
            </div>
            <div className="split-image-container">
              <img src={IMAGES.platform} alt="Traditional Ceremony Elements" className="split-image" />
            </div>
          </div>
        </section>

        <section id="marketplace" className="section-padding bg-accent">
          <div className="container split-section reversed">
            <div className="split-content">
              <h2>Community Marketplace</h2>
              <p>
                A true celebration relies on the skills of dedicated professionals. Our community
                marketplace serves as the essential bridge between hosts and the finest local
                vendors.
              </p>
              <p>
                We curate a network of trusted experts who understand the nuances of traditional
                celebrations, ensuring every detail, from the feast to the memories captured, is
                perfect.
              </p>
              <ul className="feature-list">
                <li>Connect with Expert Videographers</li>
                <li>Source Authentic Halwais</li>
                <li>Trusted Vendor Network</li>
              </ul>
            </div>
            <div className="split-image-container">
              <img src={IMAGES.marketplace} alt="Marketplace Vendor Elements" className="split-image" />
            </div>
          </div>
        </section>

        <section
          className="banner"
          style={{ backgroundImage: `url(${IMAGES.banner})` }}
        >
          <div className="banner-overlay" />
          <div className="container banner-content">
            <h2>Authentic, Seamless Celebrations</h2>
            <p>Utsav Connect — Vibrant. Regal. Modern-Traditional.</p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-logo">Utsav Connect</div>
          <ul className="footer-links">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#values">Our Values</a>
            </li>
            <li>
              <a href="#platform">Event Platform</a>
            </li>
            <li>
              <a href="#marketplace">Marketplace</a>
            </li>
            <li>
              <Link to="/login">Sign In</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
          <div className="copyright">© Utsav Connect. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
