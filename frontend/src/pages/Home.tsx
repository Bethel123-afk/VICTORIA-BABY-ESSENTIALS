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

        // Smooth transition to next step or calculation
        if (step < 3) {
            setQuizStep(step + 1);
        } else {
            setQuizStep(4); // Initiate Scanning Phase
            // Simulation of data synthesis
            setTimeout(() => {
                calculateResult(newAnswers);
            }, 1800);
        }
    };

    const calculateResult = (answers: Record<number, string>) => {
        let rec = "";
        let target = "";

        if (answers[3] === 'full') {
            rec = "<strong>Elite Configuration:</strong> Based on your focus on a complete setup, we have authorized the <strong>Elite Manifest</strong>. This spectrum provides 100% readiness for the first 90 days of neonatal care.";
            target = "Elite";
        } else if (answers[1] === 'new-mom' || answers[2] === 'late') {
            rec = "<strong>Standard Protocol:</strong> As you prepare for an immediate arrival, our <strong>Standard Package</strong> offers the optimal equilibrium of essential protection and clinical comfort.";
            target = "Standard";
        } else {
            rec = "<strong>Foundational Setup:</strong> For the experienced matriarch, we recommend the <strong>Standard Package</strong>—a curated selection of essential replenishment units.";
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
            <div className="stat-item">
               <strong className="stat-number">24/7</strong>
               <span className="stat-label">Expert Support</span>
            </div>
         </div>
      </section>

      <section className="quiz-section reveal-anim" id="quiz">
        <div className="container">
          <div className="section-header-centered">
            <span className="item-badge">PREVENTATIVE CURATION</span>
            <h2 className="section-title">Diagnostic Protocol</h2>
            <p className="section-desc">Syncing your neonatal requirements with our clinical-grade inventory.</p>
          </div>

          <div className="quiz-container-premium">
            <div className="quiz-inner">
                {quizStep === 0 && (
                <div className="quiz-intro-v2 reveal-anim">
                    <div className="protocol-icon">
                        <i className="fas fa-microscope"></i>
                    </div>
                    <h3>Initialize Selection Engine</h3>
                    <p>Enter your situational parameters to generate a bespoke procurement manifest.</p>
                    <button className="btn btn-primary" onClick={handleStartQuiz}>START DIAGNOSIS</button>
                </div>
                )}

                {quizStep >= 1 && quizStep <= 3 && (
                <div className="quiz-step-v2 active">
                    <div className="step-header">
                        <span className="step-count">Step {quizStep} of 3</span>
                        <div className="step-progress-mini">
                            <div className="bar" style={{ width: `${(quizStep / 3) * 100}%` }}></div>
                        </div>
                    </div>
                    
                    {quizStep === 1 && (
                        <div className="step-content reveal-anim">
                            <h3 className="question-text">Identify Current Status</h3>
                            <div className="options-flex">
                                <button className="option-card" onClick={() => handleQuizAnswer(1, 'new-mom')}>
                                    <div className="opt-icon"><i className="fas fa-baby"></i></div>
                                    <div className="opt-text">
                                        <strong>First Journey</strong>
                                        <span>New to motherhood</span>
                                    </div>
                                </button>
                                <button className="option-card" onClick={() => handleQuizAnswer(1, 'pro-mom')}>
                                    <div className="opt-icon"><i className="fas fa-crown"></i></div>
                                    <div className="opt-text">
                                        <strong>Experienced</strong>
                                        <span>Expanding the legacy</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {quizStep === 2 && (
                        <div className="step-content reveal-anim">
                            <h3 className="question-text">Preparation Phase</h3>
                            <div className="options-flex">
                                <button className="option-card" onClick={() => handleQuizAnswer(2, 'early')}>
                                    <div className="opt-icon"><i className="fas fa-calendar-check"></i></div>
                                    <div className="opt-text">
                                        <strong>Early Stage</strong>
                                        <span>Meticulous planning</span>
                                    </div>
                                </button>
                                <button className="option-card" onClick={() => handleQuizAnswer(2, 'late')}>
                                    <div className="opt-icon"><i className="fas fa-bolt"></i></div>
                                    <div className="opt-text">
                                        <strong>Immediate</strong>
                                        <span>Arrival imminent</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {quizStep === 3 && (
                        <div className="step-content reveal-anim">
                            <h3 className="question-text">Desired Strategic Scope</h3>
                            <div className="options-flex">
                                <button className="option-card" onClick={() => handleQuizAnswer(3, 'basics')}>
                                    <div className="opt-icon"><i className="fas fa-box-open"></i></div>
                                    <div className="opt-text">
                                        <strong>Foundational</strong>
                                        <span>Core essentials only</span>
                                    </div>
                                </button>
                                <button className="option-card" onClick={() => handleQuizAnswer(3, 'full')}>
                                    <div className="opt-icon"><i className="fas fa-layer-group"></i></div>
                                    <div className="opt-text">
                                        <strong>Full Spectrum</strong>
                                        <span>Complete ecosystem</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                )}

                {quizStep === 4 && (
                <div className="scanning-phase reveal-anim">
                    <div className="scanner">
                        <div className="scan-line"></div>
                        <i className="fas fa-dna"></i>
                    </div>
                    <h3>Synthesizing Inventory</h3>
                    <div className="scan-labels">
                        <span>CROSS-REFERENCING CLINICAL DATA...</span>
                        <span>VERIFYING STOCK LEVELS...</span>
                    </div>
                </div>
                )}

                {quizStep === 5 && (
                <div className="result-phase-v2 reveal-anim">
                    <div className="result-header">
                        <div className="check-icon"><i className="fas fa-check-double"></i></div>
                        <h3>Diagnosis Complete</h3>
                    </div>
                    <div className="result-box">
                        <p dangerouslySetInnerHTML={{ __html: recommendation }}></p>
                    </div>
                    <div className="result-actions">
                        <button className="btn btn-primary" onClick={scrolltoPackages}>INSPECT MANIFEST</button>
                        <button className="btn btn-secondary" onClick={() => setQuizStep(0)}>RE-INITIATE</button>
                    </div>
                </div>
                )}
            </div>
          </div>
        </div>
      </section>

      <section className="attributes-section reveal-anim">
          <div className="container">
              <div className="section-header-centered">
                  <span className="item-badge">SIGNATURE ATTRIBUTES</span>
                  <h2 className="section-title">The Victoria Standard</h2>
                  <p className="section-desc">Every selection is governed by our strict tripartite of excellence.</p>
              </div>
              <div className="attributes-grid">
                  <div className="attr-card stagger-1">
                      <div className="attr-icon"><i className="fas fa-fingerprint"></i></div>
                      <h4>Bespoke Selection</h4>
                      <p>Custom-curated bundles tailored to your specific delivery timeline and needs.</p>
                  </div>
                  <div className="attr-card stagger-2">
                      <div className="attr-icon"><i className="fas fa-vial"></i></div>
                      <h4>Safety Audited</h4>
                      <p>All items pass through rigorous neonatal safety screenings before inclusion.</p>
                  </div>
                  <div className="attr-card stagger-3">
                      <div className="attr-icon"><i className="fas fa-leaf"></i></div>
                      <h4>Organic Origin</h4>
                      <p>Prioritizing sustainable, hypoallergenic fibers for maximum dermal protection.</p>
                  </div>
                  <div className="attr-card stagger-4">
                      <div className="attr-icon"><i className="fas fa-shipping-fast"></i></div>
                      <h4>Expedited Delivery</h4>
                      <p>Seamless logistics ensuring your essentials arrive before your bundle of joy.</p>
                  </div>
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
            <div className={`package-card reveal-anim stagger-1 ${targetPackage === 'Standard' ? 'highlight' : ''}`}>
              <div className="package-image-container">
                <PremiumImage src="https://images.unsplash.com/photo-1515488042-288109f25154?auto=format&fit=crop&w=1000&q=80" alt="Standard Package" />
                <span className="package-tag">Daily Essentials</span>
              </div>
              <div className="package-content">
                <h3 className="package-name">Standard Package</h3>
                <p className="package-snippet">Essential neonatal care for the first month.</p>
                <div className="package-footer">
                  <div className="package-price">₦55,000</div>
                  <div className="package-btns">
                    <button className="btn-cart-minimal" onClick={() => handleAddToCart({ _id: 'std-pkg', name: 'Standard Package', price: 55000, category: 'Essential', image: 'https://images.unsplash.com/photo-1515488042-288109f25154?auto=format&fit=crop&w=1000&q=80' })} title="Add to Bag">
                        <i className="fas fa-plus"></i>
                    </button>
                    <Link to="/shop" className="btn-details-minimal" title="View Specifications">
                        <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Elite Package */}
            <div className={`package-card reveal-anim stagger-2 ${targetPackage === 'Elite' ? 'highlight' : ''} featured-kit`}>
              <div className="package-image-container">
                <PremiumImage src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80" alt="Elite Package" />
                <span className="package-tag secondary">Medical Grade</span>
              </div>
              <div className="package-content">
                <h3 className="package-name">Elite Manifest</h3>
                <p className="package-snippet">3-month comprehensive starter ecosystem.</p>
                <div className="package-footer">
                  <div className="package-price">₦120,000</div>
                  <div className="package-btns">
                    <button className="btn-cart-minimal" onClick={() => handleAddToCart({ _id: 'elite-pkg', name: 'Elite Package', price: 120000, category: 'Collection', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80' })} title="Add to Bag">
                        <i className="fas fa-plus"></i>
                    </button>
                    <Link to="/shop" className="btn-details-minimal" title="View Specifications">
                        <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Organic Set */}
            <div className="package-card reveal-anim stagger-3">
              <div className="package-image-container">
                <PremiumImage src="https://images.unsplash.com/photo-1555032339-da9ea1603099?auto=format&fit=crop&w=1000&q=80" alt="Premium Collection" />
                <span className="package-tag">Premium Organic</span>
              </div>
              <div className="package-content">
                <h3 className="package-name">Organic Unit Set</h3>
                <p className="package-snippet">High-fidelity cotton for neonatal integrity.</p>
                <div className="package-footer">
                  <div className="package-price">₦15,000</div>
                  <div className="package-btns">
                    <button className="btn-cart-minimal" onClick={() => handleAddToCart({ _id: 'onesie-set', name: 'Premium Onesie Set', price: 15000, category: 'Clothing', image: 'https://images.unsplash.com/photo-1555032339-da9ea1603099?auto=format&fit=crop&w=1000&q=80' })} title="Add to Bag">
                        <i className="fas fa-plus"></i>
                    </button>
                    <Link to="/shop" className="btn-details-minimal" title="View Specifications">
                        <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Neonatal Care Kit */}
            <div className="package-card reveal-anim stagger-4">
              <div className="package-image-container">
                <PremiumImage src="https://images.unsplash.com/photo-1510735148003-8818f8e02931?auto=format&fit=crop&w=1000&q=80" alt="Care Kit" />
                <span className="package-tag">Medical Care</span>
              </div>
              <div className="package-content">
                <h3 className="package-name">Neonatal Care Kit</h3>
                <p className="package-snippet">Clinical supplies for primary health monitoring.</p>
                <div className="package-footer">
                  <div className="package-price">₦25,000</div>
                  <div className="package-btns">
                    <button className="btn-cart-minimal" onClick={() => handleAddToCart({ _id: 'care-kit', name: 'Neonatal Care Kit', price: 25000, category: 'Health', image: 'https://images.unsplash.com/photo-1510735148003-8818f8e02931?auto=format&fit=crop&w=1000&q=80' })} title="Add to Bag">
                        <i className="fas fa-plus"></i>
                    </button>
                    <Link to="/shop" className="btn-details-minimal" title="View Specifications">
                        <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Hygiene Suite */}
            <div className="package-card reveal-anim stagger-5">
              <div className="package-image-container">
                <PremiumImage src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1000&q=80" alt="Hygiene Suite" />
                <span className="package-tag">Hygiene</span>
              </div>
              <div className="package-content">
                <h3 className="package-name">Hygiene Suite</h3>
                <p className="package-snippet">Antiseptic and biological care for newborns.</p>
                <div className="package-footer">
                  <div className="package-price">₦12,000</div>
                  <div className="package-btns">
                    <button className="btn-cart-minimal" onClick={() => handleAddToCart({ _id: 'hygiene-suite', name: 'Hygiene Suite', price: 12000, category: 'Skincare', image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1000&q=80' })} title="Add to Bag">
                        <i className="fas fa-plus"></i>
                    </button>
                    <Link to="/shop" className="btn-details-minimal" title="View Specifications">
                        <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Monitor */}
            <div className="package-card reveal-anim stagger-6">
              <div className="package-image-container">
                <PremiumImage src="https://images.unsplash.com/photo-1576402187878-974f70c890a5?auto=format&fit=crop&w=1000&q=80" alt="Health Monitor" />
                <span className="package-tag">Observation</span>
              </div>
              <div className="package-content">
                <h3 className="package-name">Health Monitor</h3>
                <p className="package-snippet">Precision observation tools for safety.</p>
                <div className="package-footer">
                  <div className="package-price">₦18,500</div>
                  <div className="package-btns">
                    <button className="btn-cart-minimal" onClick={() => handleAddToCart({ _id: 'health-mon', name: 'Health Monitor', price: 18500, category: 'Health', image: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?auto=format&fit=crop&w=1000&q=80' })} title="Add to Bag">
                        <i className="fas fa-plus"></i>
                    </button>
                    <Link to="/shop" className="btn-details-minimal" title="View Specifications">
                        <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-selection reveal-anim" style={{ padding: '80px 0', background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header-centered" style={{ marginBottom: '60px' }}>
            <span className="item-badge">CURATED SELECTION</span>
            <h2 className="section-title" style={{ fontSize: '2.5rem' }}>Trending Essentials</h2>
            <p className="section-desc">Highly sought-after units from our current registry.</p>
          </div>
          <div className="package-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div className="package-card reveal-anim stagger-1">
              <div className="package-image-container" style={{ height: '200px' }}>
                <PremiumImage src="https://images.unsplash.com/photo-1555032339-da9ea1603099?auto=format&fit=crop&w=800&q=80" alt="Onesie" />
                <span className="package-tag">Top Choice</span>
              </div>
              <div className="package-content" style={{ padding: '20px' }}>
                <h3 className="package-name" style={{ fontSize: '1.2rem' }}>Premium Cotton Onesie</h3>
                <p className="package-snippet" style={{ fontSize: '0.8rem' }}>Organic fibers for neonatal integrity.</p>
                <div className="package-footer" style={{ paddingTop: '15px' }}>
                  <div className="package-price" style={{ fontSize: '1rem' }}>₦3,500</div>
                  <div className="package-btns">
                    <button className="btn-cart-minimal" onClick={() => handleAddToCart({ _id: 'onesie', name: 'Premium Cotton Onesie', price: 3500, category: 'Essential', image: 'https://images.unsplash.com/photo-1555032339-da9ea1603099?auto=format&fit=crop&w=800&q=80' })} title="Add to Bag">
                        <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="package-card reveal-anim stagger-2">
              <div className="package-image-container" style={{ height: '200px' }}>
                <PremiumImage src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=800&q=80" alt="Blanket" />
                <span className="package-tag">Warmth</span>
              </div>
              <div className="package-content" style={{ padding: '20px' }}>
                <h3 className="package-name" style={{ fontSize: '1.2rem' }}>Thermal Fleece Blanket</h3>
                <p className="package-snippet" style={{ fontSize: '0.8rem' }}>Optimal neonatal thermal regulation.</p>
                <div className="package-footer" style={{ paddingTop: '15px' }}>
                  <div className="package-price" style={{ fontSize: '1rem' }}>₦8,000</div>
                  <div className="package-btns">
                    <button className="btn-cart-minimal" onClick={() => handleAddToCart({ _id: 'blanket', name: 'Thermal Fleece Blanket', price: 8000, category: 'Essential', image: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=800&q=80' })} title="Add to Bag">
                        <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="package-card reveal-anim stagger-3">
              <div className="package-image-container" style={{ height: '200px' }}>
                <PremiumImage src="https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80" alt="Socks" />
                <span className="package-tag">Set of 5</span>
              </div>
              <div className="package-content" style={{ padding: '20px' }}>
                <h3 className="package-name" style={{ fontSize: '1.2rem' }}>Thermal Socks Set</h3>
                <p className="package-snippet" style={{ fontSize: '0.8rem' }}>Heat-retentive for peripheral warmth.</p>
                <div className="package-footer" style={{ paddingTop: '15px' }}>
                  <div className="package-price" style={{ fontSize: '1rem' }}>₦2,500</div>
                  <div className="package-btns">
                    <button className="btn-cart-minimal" onClick={() => handleAddToCart({ _id: 'socks', name: 'Thermal Socks (Set of 5)', price: 2500, category: 'Essential', image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80' })} title="Add to Bag">
                        <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="package-card reveal-anim stagger-4">
              <div className="package-image-container" style={{ height: '200px' }}>
                <PremiumImage src="https://images.unsplash.com/photo-1544126592-807daa2b5652?auto=format&fit=crop&w=800&q=80" alt="Diapers" />
                <span className="package-tag">Sanitary</span>
              </div>
              <div className="package-content" style={{ padding: '20px' }}>
                <h3 className="package-name" style={{ fontSize: '1.2rem' }}>Premium Diaper Suite</h3>
                <p className="package-snippet" style={{ fontSize: '0.8rem' }}>High-absorbency neonatal dryness.</p>
                <div className="package-footer" style={{ paddingTop: '15px' }}>
                  <div className="package-price" style={{ fontSize: '1rem' }}>₦18,000</div>
                  <div className="package-btns">
                    <button className="btn-cart-minimal" onClick={() => handleAddToCart({ _id: 'diapers', name: 'Premium Diaper Suite', price: 18000, category: 'Essential', image: 'https://images.unsplash.com/photo-1544126592-807daa2b5652?auto=format&fit=crop&w=800&q=80' })} title="Add to Bag">
                        <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="package-card reveal-anim stagger-5">
              <div className="package-image-container" style={{ height: '200px' }}>
                <PremiumImage src="https://images.unsplash.com/photo-1604176427245-df2f5458931b?auto=format&fit=crop&w=800&q=80" alt="Swaddle" />
                <span className="package-tag">Organic</span>
              </div>
              <div className="package-content" style={{ padding: '20px' }}>
                <h3 className="package-name" style={{ fontSize: '1.2rem' }}>Muslin Swaddle Set</h3>
                <p className="package-snippet" style={{ fontSize: '0.8rem' }}>Secure, breathable comfort weave.</p>
                <div className="package-footer" style={{ paddingTop: '15px' }}>
                  <div className="package-price" style={{ fontSize: '1rem' }}>₦6,500</div>
                  <div className="package-btns">
                    <button className="btn-cart-minimal" onClick={() => handleAddToCart({ _id: 'swaddle', name: 'Muslin Swaddle Set (x3)', price: 6500, category: 'Essential', image: 'https://images.unsplash.com/photo-1604176427245-df2f5458931b?auto=format&fit=crop&w=800&q=80' })} title="Add to Bag">
                        <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="package-card reveal-anim stagger-6">
              <div className="package-image-container" style={{ height: '200px' }}>
                <PremiumImage src="https://images.unsplash.com/photo-1627993434193-de5a42f56636?auto=format&fit=crop&w=800&q=80" alt="Sterilizer" />
                <span className="package-tag">Hygiene</span>
              </div>
              <div className="package-content" style={{ padding: '20px' }}>
                <h3 className="package-name" style={{ fontSize: '1.2rem' }}>UV Sterilizer & Dryer</h3>
                <p className="package-snippet" style={{ fontSize: '0.8rem' }}>Eliminates 99.9% of neonatal germs.</p>
                <div className="package-footer" style={{ paddingTop: '15px' }}>
                  <div className="package-price" style={{ fontSize: '1rem' }}>₦25,000</div>
                  <div className="package-btns">
                    <button className="btn-cart-minimal" onClick={() => handleAddToCart({ _id: 'sterilizer', name: 'UV Sterilizer & Dryer', price: 25000, category: 'Feeding', image: 'https://images.unsplash.com/photo-1627993434193-de5a42f56636?auto=format&fit=crop&w=800&q=80' })} title="Add to Bag">
                        <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link to="/shop" className="btn btn-secondary">EXPLORE FULL REGISTRY</Link>
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
                <div className="philo-card stagger-1">
                  <i className="fas fa-shield-virus"></i>
                  <h4>Clinical Vetting</h4>
                  <p>Every inventory unit undergoes a rigorous 12-point integrity check to ensure medical-grade safety.</p>
                </div>
                <div className="philo-card stagger-2">
                  <i className="fas fa-hand-holding-heart"></i>
                  <h4>Neonatal Softness</h4>
                  <p>Materials are selected for zero-friction interaction, protecting the fragile neonatal dermal barrier.</p>
                </div>
                <div className="philo-card stagger-3">
                    <i className="fas fa-microscope"></i>
                    <h4>Textile Research</h4>
                    <p>Continuous analysis of fabric breathability and thermal regulation for optimal neonatal homeostasis.</p>
                </div>
                <div className="philo-card stagger-4">
                    <i className="fas fa-award"></i>
                    <h4>Boutique Quality</h4>
                    <p>Small-batch production protocols ensuring every stitch meets our strict legacy standards of excellence.</p>
                </div>
                <div className="philo-card stagger-5">
                    <i className="fas fa-leaf"></i>
                    <h4>Ethical Sourcing</h4>
                    <p>Priority access to sustainable, organic fibers sourced from certified biological cultivators globally.</p>
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
