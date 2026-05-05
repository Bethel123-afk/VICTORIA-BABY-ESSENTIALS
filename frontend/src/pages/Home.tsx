import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import PremiumImage from '../components/PremiumImage';
import { IProduct } from '../types';

const Home: React.FC = () => {
    const cartContext = useContext(CartContext);
    const addToCart = cartContext?.addToCart;

    const [quizStep, setQuizStep] = useState(0); // 0: intro, 1-3: steps, 4: calculating, 5: result
    const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
    const [recommendation, setRecommendation] = useState('');
    const [targetPackage, setTargetPackage] = useState('');

    const handleStartQuiz = () => {
        setQuizStep(1);
    };

    const handleQuizAnswer = (step: number, value: string) => {
        const newAnswers = { ...quizAnswers, [step]: value };
        setQuizAnswers(newAnswers);

        if (step < 3) {
            setTimeout(() => {
                setQuizStep(step + 1);
            }, 400);
        } else {
            setQuizStep(4); // Calculating
            setTimeout(() => {
                calculateResult(newAnswers);
            }, 1500);
        }
    };

    const calculateResult = (answers: Record<number, string>) => {
        let rec = "";
        let target = "";

        if (answers[3] === 'full') {
            rec = "Based on your focus on a complete setup, we highly recommend the **Elite Package**. It provides everything you need for full-scale readiness.";
            target = "Elite";
        } else if (answers[1] === 'new-mom' || answers[2] === 'late') {
            rec = "As you embark on your first journey or reach the final days, the **Standard Package** offers the perfect balance of care and comfort.";
            target = "Standard";
        } else {
            rec = "For the experienced mother seeking foundational necessity, the **Standard Package** is our carefully chosen selection of essentials.";
            target = "Standard";
        }

        setRecommendation(rec);
        setTargetPackage(target);
        setQuizStep(5);
    };

    const scrolltoPackages = () => {
        const element = document.getElementById('packages');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleAddToCart = (product: Partial<IProduct>) => {
        if (addToCart) {
            addToCart(product as IProduct);
        }
    };

  return (
    <>
      <section className="hero" id="home" style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.1))', zIndex: 1 }}></div>
        <PremiumImage src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=2000&q=80" alt="Boutique Atmosphere" style={{ width: '100%', height: '100%', position: 'absolute' }} />
        
        <div className="container hero-container">
          <div className="hero-text reveal-anim">
            <span className="item-badge stagger-1 hero-badge">NEONATAL EXCELLENCE</span>
            <h1 className="stagger-2 hero-title">Curated for <br /><span className="hero-accent">New Life</span></h1>
            <p className="stagger-3 hero-description">
              A master-class collection of baby essentials, scientifically vetted and aesthetically refined for the discerning parent.
            </p>
            <div className="hero-actions stagger-4">
              <Link to="/shop" className="btn btn-primary hero-btn">ACCESS STOREFRONT</Link>
              <a href="#packages" className="btn btn-secondary hero-btn secondary">DISCOVER KITS</a>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-strip no-print">
         <div className="container stats-container">
            <div className="stat-item">
               <strong className="stat-number">25,000+</strong>
               <span className="stat-label">Mothers Served</span>
            </div>
            <div className="stat-item">
               <strong className="stat-number">98%</strong>
               <span className="stat-label">Satisfaction Protocol</span>
            </div>
            <div className="stat-item">
               <strong className="stat-number">100%</strong>
               <span className="stat-label">Neonatal Safe</span>
            </div>
         </div>
      </section>

      <section className="quiz-section reveal-anim" id="quiz">
        <div className="container">
          <div className="section-header-centered">
            <span className="item-badge">PERSONALIZED CURATION</span>
            <h2 className="section-title">Match Your Journey</h2>
            <p className="section-desc">Identify the ideal essential configuration for your transition into motherhood.</p>
          </div>

          <div className="quiz-container reveal-anim" id="quiz-box">
            {quizStep === 0 && (
              <div className="quiz-intro">
                <i className="fas fa-microscope"></i>
                <h3 className="quiz-title">Diagnostic Protocol</h3>
                <p className="quiz-desc">
                  Our proprietary selection engine synchronizes your current needs with our clinical-grade inventory.
                </p>
                <button className="btn btn-primary start-quiz-btn" onClick={handleStartQuiz}>INITIATE SELECTION</button>
              </div>
            )}

            {quizStep === 1 && (
              <div className="quiz-step active reveal-anim" data-step="1">
                <h3 className="quiz-question">Identity Status?</h3>
                <div className="quiz-options-grid">
                  <button className="quiz-opt" onClick={() => handleQuizAnswer(1, 'new-mom')}>
                    <i className="fas fa-star-of-life"></i>
                    <span>NEONATAL FIRST JOURNEY</span>
                  </button>
                  <button className="quiz-opt" onClick={() => handleQuizAnswer(1, 'pro-mom')}>
                    <i className="fas fa-award"></i>
                    <span>EXPERIENCED MATRIARCH</span>
                  </button>
                </div>
              </div>
            )}

            {quizStep === 2 && (
              <div className="quiz-step active reveal-anim" data-step="2">
                <h3 className="quiz-question">Preparation Phase?</h3>
                <div className="quiz-options-grid">
                  <button className="quiz-opt" onClick={() => handleQuizAnswer(2, 'early')}>
                    <i className="fas fa-compass"></i>
                    <span>EARLY PROCUREMENT</span>
                  </button>
                  <button className="quiz-opt" onClick={() => handleQuizAnswer(2, 'late')}>
                    <i className="fas fa-clock"></i>
                    <span>IMMEDIATE ARRIVAL</span>
                  </button>
                </div>
              </div>
            )}

            {quizStep === 3 && (
              <div className="quiz-step active reveal-anim" data-step="3">
                <h3 style={{ textAlign: 'center', fontSize: '1.8rem', fontFamily: 'Playfair Display, serif', marginBottom: '40px' }}>Strategic Scope?</h3>
                <div className="quiz-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
                  <button className="quiz-opt" onClick={() => handleQuizAnswer(3, 'basics')} style={{ padding: '40px', background: 'var(--gray-100)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    <i className="fas fa-box" style={{ fontSize: '2rem', marginBottom: '15px', color: 'var(--secondary)' }}></i>
                    <span style={{ display: 'block', fontWeight: 600 }}>ESSENTIAL UNITS</span>
                  </button>
                  <button className="quiz-opt" onClick={() => handleQuizAnswer(3, 'full')} style={{ padding: '40px', background: 'var(--gray-100)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    <i className="fas fa-boxes-packing" style={{ fontSize: '2rem', marginBottom: '15px', color: 'var(--secondary)' }}></i>
                    <span style={{ display: 'block', fontWeight: 600 }}>COMPLETE SPECTRUM</span>
                  </button>
                </div>
              </div>
            )}

            {quizStep === 4 && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '3.5rem', color: 'var(--secondary)', marginBottom: '30px' }}></i>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '10px' }}>Synchronizing Catalog</h3>
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', letterSpacing: '1px' }}>MATCHING NEONATAL PARAMETERS...</p>
              </div>
            )}

            {quizStep === 5 && (
              <div id="quiz-result" className="reveal-anim" style={{ textAlign: 'center' }}>
                <div className="result-card">
                  <span className="item-badge" style={{ background: 'var(--secondary)', color: 'white', border: 'none' }}>OPTIMAL SELECTION FOUND</span>
                  <h3 style={{ fontSize: '2.5rem', marginBottom: '30px', fontFamily: 'Playfair Display, serif' }}>Your Bespoke Match</h3>
                  <p id="result-text" style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 50px', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: recommendation }}></p>
                  <button className="btn btn-primary" style={{ padding: '18px 50px', letterSpacing: '2px' }} onClick={scrolltoPackages}>INSPECT RECOMMENDATION</button>
                </div>
              </div>
            )}

            {quizStep > 0 && quizStep < 4 && (
              <div className="quiz-progress" style={{ marginTop: '40px' }}>
                <div className="progress-bar" style={{ width: `${(quizStep / 3) * 100}%`, height: '2px', background: 'var(--secondary)' }}></div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="packages" id="packages" style={{ padding: '120px 0' }}>
        <div className="container">
          <div className="section-title reveal-anim" style={{ textAlign: 'center', marginBottom: '80px' }}>
            <span className="item-badge">MASTER COLLECTIONS</span>
            <h2 style={{ fontSize: '3.5rem', fontFamily: 'Playfair Display, serif' }}>Validated Kits</h2>
            <p style={{ color: 'var(--text-muted)' }}>Curated configurations for every logistical requirement.</p>
          </div>

          <div className="package-grid">
            {/* Standard Package */}
            <div className={`package-card reveal-anim stagger-1 ${targetPackage === 'Standard' ? 'highlight' : ''}`} style={{ background: 'white', padding: '40px', border: '1px solid var(--gray-100)', borderRadius: '8px', transition: '0.4s' }}>
              <span className="item-badge" style={{ fontSize: '0.6rem' }}>Daily Essentials</span>
              <div className="package-image" style={{ margin: '30px 0', height: '300px', overflow: 'hidden', borderRadius: '4px' }}>
                <PremiumImage src="https://images.unsplash.com/photo-1515488042-288109f25154?auto=format&fit=crop&w=1000&q=80" alt="Standard Package" />
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem' }}>Standard Package</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.9rem' }}>Comprehensive care for the foundational month.</p>
              <div className="price" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '30px' }}>₦55,000</div>
              <div className="package-actions" style={{ display: 'flex', gap: '15px' }}>
                <button className="btn btn-primary add-to-cart" onClick={() => handleAddToCart({ _id: 'std-pkg', name: 'Standard Package', price: 55000, category: 'Essential', image: 'https://images.unsplash.com/photo-1515488042-288109f25154?auto=format&fit=crop&w=1000&q=80' })} style={{ flex: 2, padding: '15px' }}>ADD TO BAG</button>
                <Link to="/shop" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', padding: '15px', fontSize: '0.7rem' }}>SPECS</Link>
              </div>
            </div>

            {/* Elite Package */}
            <div className={`package-card reveal-anim stagger-2 featured-pkg ${targetPackage === 'Elite' ? 'highlight' : ''}`} style={{ background: 'white', padding: '40px', border: '1px solid var(--secondary)', borderRadius: '8px', transform: 'translateY(-20px)', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
              <span className="item-badge" style={{ background: 'var(--secondary)', color: 'white', border: 'none', fontSize: '0.6rem' }}>MOST PROCUREMENT</span>
              <div className="package-image" style={{ margin: '30px 0', height: '300px', overflow: 'hidden', borderRadius: '4px' }}>
                <PremiumImage src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80" alt="Elite Package" />
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem' }}>Elite Manifest</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.9rem' }}>A total 3-month medical-grade starter ecosystem.</p>
              <div className="price" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '30px' }}>₦120,000</div>
              <div className="package-actions" style={{ display: 'flex', gap: '15px' }}>
                <button className="btn btn-primary add-to-cart" onClick={() => handleAddToCart({ _id: 'elite-pkg', name: 'Elite Package', price: 120000, category: 'Collection', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80' })} style={{ flex: 2, padding: '15px' }}>ADD TO BAG</button>
                <Link to="/shop" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', padding: '15px', fontSize: '0.7rem' }}>SPECS</Link>
              </div>
            </div>

            {/* Premium Onesie */}
            <div className="package-card reveal-anim stagger-3" style={{ background: 'white', padding: '40px', border: '1px solid var(--gray-100)', borderRadius: '8px' }}>
              <span className="item-badge" style={{ fontSize: '0.6rem' }}>Premium Selection</span>
              <div className="package-image" style={{ margin: '30px 0', height: '300px', overflow: 'hidden', borderRadius: '4px' }}>
                <PremiumImage src="https://images.unsplash.com/photo-1555032339-da9ea1603099?auto=format&fit=crop&w=1000&q=80" alt="Premium Collection" />
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem' }}>Organic Unit Set</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.9rem' }}>High-fidelity cotton care for neonatal integrity.</p>
              <div className="price" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '30px' }}>₦15,000</div>
              <div className="package-actions" style={{ display: 'flex', gap: '15px' }}>
                <button className="btn btn-primary add-to-cart" onClick={() => handleAddToCart({ _id: 'onesie-set', name: 'Premium Onesie Set', price: 15000, category: 'Clothing', image: 'https://images.unsplash.com/photo-1555032339-da9ea1603099?auto=format&fit=crop&w=1000&q=80' })} style={{ flex: 2, padding: '15px' }}>ADD TO BAG</button>
                <Link to="/shop" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', padding: '15px', fontSize: '0.7rem' }}>SPECS</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section reveal-anim" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-text-content stagger-1">
              <span className="item-badge about-badge">OUR PHILOSOPHY</span>
              <h2 className="legacy-title">
                Integrity in <br /><span>Every Fiber</span>
              </h2>
              <p className="about-quote">
                "We do not merely sell products; we authorize peace of mind for the transition into parenthood."
              </p>
              <div className="philosophy-grid">
                <div className="philo-card">
                  <i className="fas fa-shield-virus"></i>
                  <h4>Clinical Vetting</h4>
                  <p>Every inventory unit undergoes a rigorous 12-point integrity check.</p>
                </div>
                <div className="philo-card">
                  <i className="fas fa-hand-holding-heart"></i>
                  <h4>Neonatal Softness</h4>
                  <p>Materials selected for zero-friction interaction with newborn skin.</p>
                </div>
              </div>
            </div>
            <div className="about-image-container stagger-3">
              <PremiumImage
                src="https://images.unsplash.com/photo-1510735148003-8818f8e02931?auto=format&fit=crop&w=1200&q=80"
                alt="Our Philosophy"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
