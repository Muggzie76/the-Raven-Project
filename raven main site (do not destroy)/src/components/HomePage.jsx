import React from 'react';
import { Link } from 'react-router-dom';
import Image from './Image/Image';
import BlogGrid from './BlogGrid';
import './HomePage.css';

const HomePage = () => {
    return (
        <>
            <section id="home" className="hero">
                <div className="hero-content">
                    <h1>Welcome to The Raven Project</h1>
                    <p>Exploring the mystical world of crypto through the eyes of Raven, daughter of Azarath</p>
                </div>
            </section>

            <section id="powers" className="bento-grid">
                <div className="bento-item large">
                    <div className="bento-image">
                        <Image src="/Memes and Images/IMG_1229.PNG" alt="Azarath - Raven's Birthplace" />
                    </div>
                    <div className="content">
                        <h2>Azarath Metrion Zinthos</h2>
                        <div className="quote">
                            "It was too late for Earth, just as it was too late for Azarath."
                        </div>
                        <div className="attribution">―Arella explaining the results of Trigon's evil presence should the prophecy come to pass.</div>
                        <p>
                            Azarath is the parallel world and birthplace of Raven. Her mother, Arella, was brought here from Gotham City (under her birth-name, Angela Roth) to hide from Trigon's evil and to shield her only daughter as best she could. It was a peaceful dimension where its residents were taught pacifism, led by their leader Azar, who led the order that originally sealed Trigon into his prison.
                        </p>
                        <p>
                            Just as Raven channels her powers through these sacred words, we harness their essence in the crypto realm, bringing stability and focus to the volatile markets.
                        </p>
                    </div>
                </div>
                <div className="bento-item">
                    <div className="bento-image">
                        <Image src="/Memes and Images/IMG_1271.PNG" alt="Telekinesis" />
                    </div>
                    <h2>Telekinesis</h2>
                    <p>Moving through the blockchain with the power of mind and will. Like Raven's ability to move objects with thought, we navigate the digital asset space with precision and control.</p>
                </div>
                <div className="bento-item">
                    <div className="bento-image">
                        <Image src="/Memes and Images/IMG_1272.PNG" alt="Dark Energy" />
                    </div>
                    <h2>Dark Energy</h2>
                    <p>Harnessing the power of decentralized networks through Raven's mystical dark energy manipulation. Converting traditional energy into blockchain power, just as Raven channels her emotions into force.</p>
                </div>
                <div className="bento-item tall">
                    <div className="bento-image">
                        <Image src="/Memes and Images/IMG_1265.PNG" alt="Soul-Self Projection" />
                    </div>
                    <h2>Soul-Self Projection</h2>
                    <p>Just as Raven can project her soul-self across dimensions, we project our vision across the crypto universe. Her ability to traverse realms mirrors our cross-chain capabilities and multiverse exploration.</p>
                </div>
                <div className="bento-item">
                    <div className="bento-image">
                        <Image src="/Memes and Images/IMG_1253.PNG" alt="Empathy" />
                    </div>
                    <h2>Empathy</h2>
                    <p>Understanding the crypto community's pulse through Raven's empathic abilities. Sensing market emotions and community sentiment to navigate the future of decentralized finance.</p>
                </div>
                <div className="bento-item wide">
                    <div className="bento-image">
                        <Image src="/Memes and Images/IMG_1441.PNG" alt="Mystical Knowledge" />
                    </div>
                    <h2>Mystical Knowledge</h2>
                    <p>Drawing from Raven's vast mystical knowledge and meditation practices from the monks of Azarath, we bring ancient wisdom to modern blockchain technology. Combining spiritual insight with technical innovation.</p>
                </div>
            </section>

            <section id="about" className="about-section">
                <h2>The Prophecy</h2>
                <div className="about-content">
                    <p>Born in the mystical realm of Azarath, Raven's journey from containing dark powers to becoming a force for good mirrors our mission in the crypto space. Just as she learned to master her abilities through discipline and wisdom, The Raven Project aims to bring order and purpose to the wild world of meme coins.</p>
                    <p>Our community, like the Teen Titans, stands united in the face of market volatility, wielding Raven's teachings of control, focus, and strategic power to navigate the crypto universe.</p>
                </div>
            </section>

            <section id="blog" className="blog-section">
                <h2>Raven's Insights</h2>
                <BlogGrid />
            </section>
        </>
    );
};

export default HomePage; 