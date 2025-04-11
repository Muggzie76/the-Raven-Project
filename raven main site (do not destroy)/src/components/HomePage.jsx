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
                    <p>Raven can telekinetically manipulate objects by putting a little of her soul into whatever she is moving – she becomes a part of it and it becomes a part of her. She can move close to two tons and normally encases objects in the same dark energy that composes her soul-self. Like Raven's ability to move objects with thought, we navigate the digital asset space with precision and control.</p>
                </div>
                <div className="bento-item">
                    <div className="bento-image">
                        <Image src="/Memes and Images/IMG_1272.PNG" alt="Dark Energy" />
                    </div>
                    <h2>Dark Energy</h2>
                    <p>Raven can mold her soul-self energy into any shape, from giant hands to razor-sharp blades. She can send solid bolts as projectiles and create force-field domes. Her powers are controlled by emotion: the more she feels, the more energy is released. Harnessing this concept of conversion, we transform traditional energy into blockchain power, just as Raven channels her emotions into force.</p>
                </div>
                <div className="bento-item tall">
                    <div className="bento-image">
                        <Image src="/Memes and Images/IMG_1265.PNG" alt="Soul-Self Projection" />
                    </div>
                    <h2>Soul-Self Projection</h2>
                    <p>Raven can project her "soul-self," a powerful bird-shaped astral form composed of dark energy. This soul-self separates from her body and possesses all her powers and more. It allows her to cover great distances, serves as a portal to other dimensions, can be used to enter the minds of others, and pass through solid matter. Just as Raven can project her essence across dimensions, we project our vision across the crypto universe, with cross-chain capabilities and multiverse exploration.</p>
                </div>
                <div className="bento-item">
                    <div className="bento-image">
                        <Image src="/Memes and Images/IMG_1253.PNG" alt="Empathy" />
                    </div>
                    <h2>Empathy</h2>
                    <p>Raven has the empathic ability to read and manipulate the emotions of others. As an empath, she can sense people if they're nearby or have been in a place, and can even sense if someone's mind has been tampered with. She can receive precognitive flashes of the future when exposed to extreme emotion. This sensitivity to emotional currents helps us understand the crypto community's pulse and navigate the future of decentralized finance.</p>
                </div>
                <div className="bento-item wide">
                    <div className="bento-image">
                        <Image src="/Memes and Images/IMG_1441.PNG" alt="Mystical Knowledge" />
                    </div>
                    <h2>Mystical Knowledge</h2>
                    <p>Raven has been shown using spells and incantations for various magical effects. The dark magic she learned allows her to perform powerful feats, break binding spells, and create protective curses. She often chants the incantation "Azarath Metrion Zinthos" to focus her abilities further, allowing her to perform greater feats; she also uses this phrase as a mantra while meditating. Drawing from this vast mystical knowledge, we bring ancient wisdom to modern blockchain technology, combining spiritual insight with technical innovation.</p>
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