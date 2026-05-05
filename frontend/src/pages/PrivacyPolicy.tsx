import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
    return (
        <main style={{ background: '#fafafa', minHeight: '100vh', padding: '120px 0 80px' }}>
            <div className="container">
                <div className="reveal-anim" style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '60px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', border: '1px solid var(--gray-100)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <span className="item-badge">LEGAL ARCHIVE</span>
                        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', marginTop: '10px' }}>Privacy Protocol</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Last Updated: May 2026</p>
                    </div>

                    <div className="policy-content" style={{ lineHeight: 1.8, color: 'var(--text-main)' }}>
                        <section style={{ marginBottom: '40px' }}>
                            <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--primary)', marginBottom: '15px' }}>1. Data Acquisition</h2>
                            <p>
                                At Victoria Baby Essentials, we prioritize the sanctity of your digital identity. We collect only the essential parameters required to authorize and fulfill your procurement manifests, including nomenclature, digital address, and geographical delivery coordinates.
                            </p>
                        </section>

                        <section style={{ marginBottom: '40px' }}>
                            <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--primary)', marginBottom: '15px' }}>2. Strategic Utilization</h2>
                            <p>
                                Your information is utilized strictly for:
                                <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                                    <li>Execution of procurement manifests and delivery logistics.</li>
                                    <li>Integration of diagnostic quiz data for personalized curation.</li>
                                    <li>Transmission of seasonal wisdom and inventory updates via the Victoria Journal.</li>
                                    <li>Enhancement of the boutique's digital infrastructure.</li>
                                </ul>
                            </p>
                        </section>

                        <section style={{ marginBottom: '40px' }}>
                            <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--primary)', marginBottom: '15px' }}>3. Cryptographic Security</h2>
                            <p>
                                All sensitive data, including authentication credentials and transaction logs, are protected by industry-standard cryptographic protocols. Payment processing is handled externally via Flutterwave's secure gateway, ensuring your financial integrity is never compromised within our registry.
                            </p>
                        </section>

                        <section style={{ marginBottom: '40px' }}>
                            <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--primary)', marginBottom: '15px' }}>4. Rights & Autonomy</h2>
                            <p>
                                As a vetted member of the Victoria community, you retain full autonomy over your records. You may request an audit or deletion of your identity from our database at any time via your Dashboard settings or by contacting our logistics support.
                            </p>
                        </section>

                        <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '40px', marginTop: '60px', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                For deeper inquiries regarding our privacy standards, please contact our Registry Archive at:
                                <br />
                                <strong style={{ color: 'var(--secondary)' }}>support@victoriababy.com</strong>
                            </p>
                            <Link to="/" className="btn btn-secondary" style={{ marginTop: '30px', display: 'inline-block' }}>RETURN TO ATELIER</Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PrivacyPolicy;
