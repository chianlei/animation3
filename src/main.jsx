import React, { useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const A = "/assets/";
const sodas = [
  ["King Coco", "Coke + Coconut + Vanilla + Coconut Cream", "17.png"],
  [
    "Magic Marker",
    "Sprite Zero + Sugar Free Peach + Sugar Free Blue Raspberry + Sugar Free Lime",
    "18.png",
  ],
  ["Glow Up", "Fanta + Vanilla + Cold foam", "19.png"],
  ["Shenron", "Mountain Dew + Lime + Pineapple", "20.png"],
  ["Princess Peach", "Coke Zero + Peach + Almond Creamer", "21.png"],
  ["Infinite Aura", "Mountain Dew Code Red + Cherry + Cold Foam", "22.png"],
  ["Out of Office", "Sprite + Coconut + Pineapple + Coconut Cream", "23.png"],
  ["My Leige", "Dr. Pepper + Black Cherry + Vanilla + Cold Foam", "24.png"],
  ["Triton Twist", "Red Bull + Peach + Blue Raspberry + Cold Foam", "25.png"],
  [
    "Dark Matter",
    "Sugar Free Red Bull + Sugar Free Pineapple + Sugar Free Blue Raspberry",
    "26.png",
  ],
  [
    "Magic Marker",
    "Sprite Zero + Sugar Free Peach + Sugar Free Blue Raspberry + Sugar Free Lime",
    "18.png",
  ],
  [
    "Chillax",
    "Coke Zero + Sugar Free Vanilla + Sugar Free Cherry + Sugar Free Creamer",
    "27.png",
  ],
  [
    "Johnny's Cosmo",
    "Sprite Zero + Raspberry + Blue Raspberry + Cherry + Black Cherry + Lime",
    "28.png",
  ],
  ["Electric Slide", "Sprite + Blue Raspberry + Lime + Cold Foam", "29.png"],
];
const snackSet = [
  ["Miss Vicky’s Spicy Pepperoncini & Focaccia", "🇨🇦", "33.webp"],
  ["Propitious Mango Ice Cream", "🇯🇵", "34.webp"],
  ["Dubai Style Kadayif & Pistachio Chocolate", "🇦🇪", "35.webp"],
];
const snacks = [...snackSet, ...snackSet];
function OpenNowTicker({ bottom = false }) {
  return (
    <div
      className={`worldTicker${bottom ? " worldTickerBottom" : ""}`}
      aria-label="Open now"
    >
      <span>
        {[0, 1].map((track) => (
          <div className="tickerTrack" key={track} aria-hidden={track === 1}>
            {[0, 1, 2, 3, 4, 5].map((group) => (
              <div className="tickerGroup" key={group}>
                {[0, 1, 2].map((item) => (
                  <b key={item}>
                    🗓️ <em>OPEN NOW!</em>
                  </b>
                ))}
              </div>
            ))}
          </div>
        ))}
      </span>
    </div>
  );
}
function App() {
  const [menu, setMenu] = useState(false);
  const [sodaPage, setSodaPage] = useState(0);
  const [snackPage, setSnackPage] = useState(0);
  const storyRef = useRef(null);
  const definitionRef = useRef(null);
  const sodaRailRef = useRef(null);
  const snackRailRef = useRef(null);
  const lastSodaPage = Math.ceil(sodas.length / 3) - 1;

  const scrollSodas = (direction) => {
    const rail = sodaRailRef.current;
    const card = rail?.firstElementChild;
    if (!rail || !card) return;
    const gap = parseFloat(getComputedStyle(rail).gap) || 0;
    const pageWidth = (card.getBoundingClientRect().width + gap) * 3;
    const targetPage = Math.max(
      0,
      Math.min(lastSodaPage, sodaPage + direction),
    );
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    rail.scrollTo({
      left: Math.min(targetPage * pageWidth, maxScroll),
      behavior: "smooth",
    });
  };

  useLayoutEffect(() => {
    const story = storyRef.current;
    if (!story) return undefined;
    let alignTimer;
    let alignStory;
    if (window.location.hash === "#story") {
      document.documentElement.style.scrollBehavior = "auto";
      alignStory = () => window.scrollTo(0, story.offsetTop);
      alignStory();
      requestAnimationFrame(alignStory);
      alignTimer = window.setTimeout(() => {
        alignStory();
        document.documentElement.style.scrollBehavior = "";
      }, 800);
      window.addEventListener("load", alignStory, { once: true });
    }

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".storyScene", { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(".scene01", { autoAlpha: 1, pointerEvents: "auto" });
        gsap.set(".sceneAsset", { clearProps: "transform" });
        gsap.set(story, { backgroundColor: "#fff", color: "#444" });
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const scenes = gsap.utils.toArray(".storyScene");
        const dropDistance = () => -Math.max(story.offsetHeight * 1.22, 860);
        const decorDropDistance = () => dropDistance() * 0.3;
        const textDropDistance = () => -Math.max(story.offsetHeight * 0.5, 360);
        const dropOffsetX = () => Math.max(story.offsetWidth * 0.08, 90);
        const sceneConfigs = [
          {
            selector: ".scene01",
            bottomDecor: ".miniCupBottom",
            background: "#fff",
            color: "#444",
          },
          {
            selector: ".scene02",
            bottomDecor: ".orangeBottom",
            background: "#ef5b13",
            color: "#fff",
          },
          {
            selector: ".scene03",
            bottomDecor: ".berryBottom",
            background: "#d73c38",
            color: "#fff",
          },
        ];
        const sceneInterval = 2.2;
        const fallDuration = 0.82;
        const reboundDuration = 0.12;
        const decorFallDuration = 0.82;
        const decorReboundDuration = 0.14;
        const bottomDecorRevealDelay = 0.32;
        const textFallDuration = 0.82;
        const textReboundDuration = 0.14;

        gsap.set(scenes, { autoAlpha: 0, pointerEvents: "none" });

        const timeline = gsap.timeline({
          repeat: -1,
          defaults: { overwrite: "auto" },
        });

        const addSceneTransition = (config, index) => {
          const start = index * sceneInterval;
          const label = `scene-${index}`;
          const mainAsset = `${config.selector} .mainAsset`;
          const decor = `${config.selector} .sceneDecor`;
          const bottomDecor = `${config.selector} ${config.bottomDecor}`;
          const animatedText = `${config.selector} .stageNumber, ${config.selector} .stageWords`;

          timeline
            .addLabel(label, start)
            // Every scene uses the same gravity-led fall. Only its artwork,
            // copy and background color change between 01, 02 and 03.
            .set(scenes, { autoAlpha: 0, pointerEvents: "none" }, label)
            .set(
              config.selector,
              { autoAlpha: 1, pointerEvents: "auto" },
              label,
            )
            .set(
              mainAsset,
              {
                x: dropOffsetX,
                y: dropDistance,
                scale: 0.88,
                rotate: 100,
                autoAlpha: 1,
              },
              label,
            )
            .set(
              decor,
              {
                y: decorDropDistance,
                scale: 0.94,
                "--decor-swing": "16deg",
                autoAlpha: 1,
              },
              label,
            )
            .set(bottomDecor, { autoAlpha: 0 }, label)
            .set(animatedText, { y: textDropDistance, autoAlpha: 1 }, label)
            .to(
              story,
              {
                backgroundColor: config.background,
                color: config.color,
                duration: 0.24,
                ease: "none",
              },
              label,
            )
            .to(
              mainAsset,
              {
                x: 0,
                y: 0,
                scale: 1,
                rotate: 21,
                duration: fallDuration,
                ease: "power1.inOut",
              },
              label,
            )
            .to(
              mainAsset,
              {
                x: 2,
                y: 0,
                scale: 1,
                duration: reboundDuration,
                ease: "power2.out",
              },
              `${label}+=${fallDuration}`,
            )
            .to(
              mainAsset,
              {
                x: 0,
                duration: 0.12,
                ease: "power1.out",
              },
              `${label}+=${fallDuration + reboundDuration}`,
            )
            .to(
              decor,
              {
                y: 8,
                scale: 1,
                "--decor-swing": "-2deg",
                duration: decorFallDuration,
                ease: "power2.in",
              },
              label,
            )
            .to(
              bottomDecor,
              { autoAlpha: 1, duration: 0.32, ease: "power1.out" },
              `${label}+=${bottomDecorRevealDelay}`,
            )
            .to(
              decor,
              {
                y: 0,
                "--decor-swing": "0deg",
                duration: decorReboundDuration,
                ease: "power2.out",
              },
              `${label}+=${decorFallDuration}`,
            )
            .to(
              animatedText,
              {
                y: 10,
                duration: textFallDuration,
                ease: "power1.inOut",
              },
              label,
            )
            .to(
              animatedText,
              {
                y: 0,
                duration: textReboundDuration,
                ease: "power2.out",
              },
              `${label}+=${textFallDuration}`,
            );
        };

        sceneConfigs.forEach(addSceneTransition);
        timeline.to({}, { duration: 0.62 });

        return () => timeline.kill();
      });

      return () => {
        media.revert();
      };
    }, story);

    return () => {
      context.revert();
      if (alignTimer) window.clearTimeout(alignTimer);
      if (alignStory) window.removeEventListener("load", alignStory);
    };
  }, []);

  useLayoutEffect(() => {
    const definition = definitionRef.current;
    if (!definition) return undefined;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".heroDrink", {
          autoAlpha: 1,
          xPercent: -50,
          yPercent: 0,
          rotate: 0,
          scale: 1,
        });
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          ".heroDrink",
          {
            autoAlpha: 1,
            xPercent: -50,
            yPercent: -92,
            rotate: 14,
            scale: 1,
          },
          {
            autoAlpha: 1,
            xPercent: -50,
            yPercent: 0,
            rotate: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: definition,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        return () => tween.scrollTrigger?.kill();
      });

      return () => media.revert();
    }, definition);

    return () => context.revert();
  }, []);
  return (
    <main>
      <div className="openNowBar" aria-label="Open now">
        <span>
          <b aria-hidden="true">🗓️</b> OPEN NOW
        </span>
        <span>
          <b aria-hidden="true">🗓️</b> OPEN NOW
        </span>
        <span>
          <b aria-hidden="true">🗓️</b> OPEN NOW
        </span>
      </div>
      <header className="nav">
        <button className="menuBtn" onClick={() => setMenu(!menu)}>
          MENU
        </button>
        <nav className={menu ? "open" : ""}>
          <a href="#about">About Us</a>
          <a href="#sodas">Dirty Sodas</a>
          <a href="#snacks">Exotic Snacks</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="logo" href="#top">
          <img src={A + "01.webp"} />
        </a>
        <a className="order" href="#sodas">
          <span className="orderMark" aria-hidden="true" />
          Order Now
        </a>
      </header>
      <section className="cartHero" id="top">
        <div className="eventCard">
          <div className="eventText">
            <small>▣ &nbsp; MOBILE CART AVAILABLE</small>
            <h1>Bring the soda cart to your next event.</h1>
            <p>
              Our mobile cart is ready for weddings, corporate events, pop-ups,
              and
              <br className="desktopBreak" /> private celebrations — serving
              bright drinks and snacks wherever the party is.
            </p>
          </div>
          <div className="eventActions">
            <div className="eventTypes">
              <b>♡ &nbsp;Weddings</b>
              <b>♙ &nbsp;Corporate</b>
              <b>▣ &nbsp;Pop-ups</b>
            </div>
            <a href="#contact">
              Request event info <span>→</span>
            </a>
          </div>
          <a className="bookBadge" href="#contact">
            BOOK
            <br />
            <small>THE CART</small>
          </a>
        </div>
      </section>
      <section className="story" id="story" ref={storyRef}>
        <div className="storySticky">
          <article className="storyScene scene01">
            <span className="stageNumber stageZero">0</span>
            <strong className="stageNumber stageDigit">1</strong>
            <div className="stageWords">
              <p>Your ONE STOP</p>
              <h2>
                <span>FLAVOR</span>
                <span>SHOP</span>
              </h2>
            </div>
            <img
              className="sceneAsset mainAsset sceneCola"
              src={A + "09.webp"}
              alt="Johnny's cola dirty soda"
            />
            <img
              className="sceneAsset sceneDecor miniCup miniCupTop"
              src={A + "04.webp"}
              alt=""
            />
            <img
              className="sceneAsset sceneDecor miniCupBlur"
              src={A + "04.webp"}
              alt=""
            />
            <img
              className="sceneAsset sceneDecor miniCup miniCupBottom"
              src={A + "06.webp"}
              alt=""
            />
          </article>
          <article className="storyScene scene02">
            <span className="stageNumber stageZero">0</span>
            <strong className="stageNumber stageDigit">2</strong>
            <div className="stageWords">
              <p>Your exotic</p>
              <h2>
                <span>FLAVOR</span>
                <span>TRIP</span>
              </h2>
            </div>
            <img
              className="sceneAsset mainAsset sceneOrangeDrink"
              src={A + "10.webp"}
              alt="Johnny's orange dirty soda"
            />
            <img
              className="sceneAsset sceneDecor sceneOrange orangeTop"
              src={A + "02.webp"}
              alt="Orange flavor"
            />
            <img
              className="sceneAsset sceneDecor sceneOrange orangeRight"
              src={A + "02.webp"}
              alt=""
            />
            <img
              className="sceneAsset sceneDecor sceneOrange orangeBottom"
              src={A + "02.webp"}
              alt=""
            />
          </article>
          <article className="storyScene scene03">
            <img
              className="berry sceneDecor berrySmall"
              src={A + "strawberry-3d.png"}
              alt=""
            />
            <img
              className="berry sceneDecor berryLarge"
              src={A + "strawberry-3d.png"}
              alt=""
            />
            <img
              className="berry sceneDecor berryBottom"
              src={A + "strawberry-3d.png"}
              alt=""
            />
            <span className="stageNumber stageZero">0</span>
            <strong className="stageNumber stageDigit">3</strong>
            <div className="stageWords">
              <p>Your ONE STOP</p>
              <h2>
                <span>FLAVOR</span>
                <span>FIX</span>
              </h2>
            </div>
            <img
              className="sceneAsset mainAsset sceneDrink"
              src={A + "13.webp"}
              alt="Johnny's pink dirty soda"
            />
          </article>
          <div className="storyDescription">
            Johnny's Dirty Soda And Exotic Snacks, It's A Mouthful But That's
            Kind Of What We Are All About. Welcome To Your One Stop Shop For
            Delicious Drinks And Snacks From All Over The World.
          </div>
          <a
            className="storyOrder"
            href="https://www.doordash.com/store/johnnys-dirty-soda-1722-w-belmont-ave-chicago-40558927/97830148/"
            target="_blank"
            rel="noopener"
          >
            <img src={A + "07.png"} alt="" /> Order
          </a>
          <a className="snackPreview" href="#snacks">
            <img src={A + "08.webp"} alt="Featured exotic snack" />
            <div className="snackPreviewCopy">
              <h3>Explore Our Snacks</h3>
              <svg viewBox="0 0 228 36" aria-hidden="true">
                <rect
                  x="0.5"
                  y="0.5"
                  width="227"
                  height="35"
                  rx="17.5"
                  fill="white"
                  stroke="black"
                />
                <path
                  d="M144.707 18.7071C145.098 18.3166 145.098 17.6834 144.707 17.2929L138.343 10.9289C137.953 10.5384 137.319 10.5384 136.929 10.9289C136.538 11.3195 136.538 11.9526 136.929 12.3431L142.586 18L136.929 23.6569C136.538 24.0474 136.538 24.6805 136.929 25.0711C137.319 25.4616 137.953 25.4616 138.343 25.0711L144.707 18.7071ZM84 18V19H144V18V17H84V18Z"
                  fill="#4D4D4D"
                />
              </svg>
            </div>
          </a>
        </div>
      </section>
      <section className="definition" id="about" ref={definitionRef}>
        <div className="definitionBackdrop" aria-hidden="true">
          <img src={A + "dirty-soda-texture.svg"} alt="" />
        </div>
        <div className="pour">
          <img src={A + "15.webp"} />
        </div>
        <div className="definitionCopy">
          <h2>Dirty Soda? Let’s Get Into It.</h2>
          <p>
            It’s not what you think. Dirty soda means taking your standard Coke
            or Pepsi base and mixing in flavors like coconut, vanilla, or
            cherry—with sweet cream or lime to finish. The possibilities are
            truly endless!
          </p>
        </div>
        <img className="heroDrink" src={A + "13.webp"} />
      </section>
      <section className="about">
        <div className="aboutText">
          <h2>About Us</h2>
          <p>
            Hi! We are a <strong>local family owned business</strong> and have
            all been born and raised here in Chicago. We’re here to bring back
            that sweet sense of community—one fizzy glass and savory snack at a
            time. We are so excited to bring a new experience and{" "}
            <strong>flavor to Lakeview.</strong>
          </p>
          <hr />
          <p>
            As we start making our mark, we believe in the power of local
            connections and <strong>community creativity.</strong> Whether
            you&apos;re a local artist, small business, event organizer, or just
            someone with a fun idea, we’d love to hear from you. Reach out—let’s
            dream up something cool together!
          </p>
        </div>
        <div className="aboutPhoto">
          <img src={A + "16.webp"} />
        </div>
        <div className="aboutWave" aria-hidden="true">
          <svg
            viewBox="0 0 1517 126"
            preserveAspectRatio="none"
            width="100%"
            height="100%"
          >
            <path
              d="M1302.81 68.8083C1269.04 104.045 1221.4 126 1168.62 126C1114.08 126 1065.05 102.57 1031.12 65.2734C1006.54 77.2532 978.903 83.9804 949.687 83.9804C918.821 83.9804 889.718 76.4713 864.117 63.1924C830.131 101.696 780.299 126 724.761 126C670.88 126 622.368 103.124 588.488 66.5992C564.609 77.7484 537.952 83.9804 509.832 83.9804C486.086 83.9804 463.383 79.5354 442.515 71.4394C408.919 105.133 362.357 126 310.898 126C264.393 126 221.887 108.959 189.337 80.81C178.194 82.89 166.699 83.9804 154.949 83.9804C90.1777 83.9804 33.1625 50.9253 0 0.837769H1516.5C1482.48 40.7377 1433.24 83.9804 1376.55 83.9804C1350.34 83.9804 1325.41 78.568 1302.81 68.8083Z"
              fill="#833CA1"
            />
          </svg>
        </div>
      </section>
      <section className="sodas" id="sodas">
        <header>
          <div className="sodasHeading">
            <small>Our Sodas</small>
            <h2>Dirty Sodas. Clean Hits.</h2>
          </div>
          <div className="sodasBody">
            <p>
              Whether you're in the mood for something fruity, fizzy, or
              fabulously refreshing, our collection of beverages and juices has
              something for every taste.
            </p>
          </div>
        </header>
        <div className="sodaCarousel">
          <div
            className="sodaRail"
            ref={sodaRailRef}
            onScroll={(event) => {
              const rail = event.currentTarget;
              const card = rail.firstElementChild;
              if (!card) return;
              const gap = parseFloat(getComputedStyle(rail).gap) || 0;
              const pageWidth = (card.getBoundingClientRect().width + gap) * 3;
              const maxScroll = rail.scrollWidth - rail.clientWidth;
              const atEnd = rail.scrollLeft >= maxScroll - 2;
              setSodaPage(
                atEnd ? lastSodaPage : Math.round(rail.scrollLeft / pageWidth),
              );
            }}
          >
            {sodas.map((s, i) => (
              <article key={`${s[0]}-${i}`}>
                <span>0{i + 1}</span>
                <div className="drinkBlob">
                  <img src={A + s[2]} />
                </div>
                <div className="sodaContent">
                  <h3>{s[0]}</h3>
                  <p>{s[1]}</p>
                </div>
              </article>
            ))}
          </div>
          {sodaPage > 0 && (
            <button
              className="sodaNext sodaNextLeft"
              type="button"
              aria-label="Previous sodas"
              onClick={() => scrollSodas(-1)}
            >
              <img src={A + "30.png"} alt="" />
            </button>
          )}
          {sodaPage < lastSodaPage && (
            <button
              className="sodaNext sodaNextRight"
              type="button"
              aria-label="Next sodas"
              onClick={() => scrollSodas(1)}
            >
              <img src={A + "31.png"} alt="" />
            </button>
          )}
        </div>
        <a
          className="sodaOrder"
          href="https://www.doordash.com/store/johnnys-dirty-soda-1722-w-belmont-ave-chicago-40558927/97830148/"
          target="_blank"
          rel="noreferrer"
        >
          <img src={A + "07.png"} alt="" /> Order Now
        </a>
      </section>
      <section className="world">
        <OpenNowTicker />
        <div className="worldCopy">
          <h2>
            Snacks from
            <br />
            all over the
            <br />
            globe
          </h2>
          <p>
            From Korea to Mexico, Japan to the UK—Johnny’s snack lineup is a
            <strong> passport to flavor.</strong> We handpick the boldest,
            crunchiest, sweetest{" "}
            <strong>snacks from all over the globe.</strong>
          </p>
          <a
            className="worldOrder"
            href="https://www.doordash.com/store/johnnys-dirty-soda-1722-w-belmont-ave-chicago-40558927/97830148/"
            target="_blank"
            rel="noopener"
          >
            <img src={A + "03.png"} alt="" />
            <span>Order Now</span>
          </a>
        </div>
        <img
          src={A + "32.webp"}
          alt="The globe centered on Africa and Europe"
        />
        <OpenNowTicker bottom />
      </section>
      <section className="snacks" id="snacks">
        <header className="snacksIntro">
          <div>
            <small>Our Exotic Snacks</small>
            <h2>
              Snacks You’ve
              <br />
              Never Seen
            </h2>
          </div>
          <p>
            Why settle for boring? At Johnny’s, every snack is a new flavor
            trip. Sweet, salty, sour, spicy—we’ve got it all. And we’re always
            hunting for the next big bite.
          </p>
        </header>
        <div className="snackCarousel">
          <div
            className="snackGrid"
            ref={snackRailRef}
            onScroll={(event) => {
              const rail = event.currentTarget;
              const maxScroll = rail.scrollWidth - rail.clientWidth;
              setSnackPage(rail.scrollLeft > maxScroll / 2 ? 1 : 0);
            }}
          >
            {snacks.map((s, i) => (
              <article key={`${s[0]}-${i}`}>
                <div className="snackImage">
                  <img src={A + s[2]} alt="" />
                </div>
                <h3>{s[0]}</h3>
                <b className="snackFlag">{s[1]}</b>
              </article>
            ))}
          </div>
          {snackPage === 0 ? (
            <button
              className="snackNext snackNextRight"
              type="button"
              aria-label="Next snacks"
              onClick={() => {
                const rail = snackRailRef.current;
                if (!rail) return;
                rail.scrollTo({
                  left: rail.scrollWidth - rail.clientWidth,
                  behavior: "smooth",
                });
              }}
            >
              <img src={A + "31.png"} alt="" />
            </button>
          ) : (
            <button
              className="snackNext snackNextLeft"
              type="button"
              aria-label="Previous snacks"
              onClick={() => {
                const rail = snackRailRef.current;
                if (!rail) return;
                rail.scrollTo({ left: 0, behavior: "smooth" });
              }}
            >
              <img src={A + "30.png"} alt="" />
            </button>
          )}
        </div>
        <a
          className="snacksOrder"
          href="https://www.doordash.com/store/johnnys-dirty-soda-1722-w-belmont-ave-chicago-40558927/97830148/"
          target="_blank"
          rel="noopener"
        >
          <img src={A + "07.png"} alt="" /> Order Now
        </a>
        <div className="snacksWave" aria-hidden="true">
          <svg
            viewBox="0 0 1517 126"
            preserveAspectRatio="none"
            width="100%"
            height="100%"
          >
            <path
              d="M1302.81 68.8083C1269.04 104.045 1221.4 126 1168.62 126C1114.08 126 1065.05 102.57 1031.12 65.2734C1006.54 77.2532 978.903 83.9804 949.687 83.9804C918.821 83.9804 889.718 76.4713 864.117 63.1924C830.131 101.696 780.299 126 724.761 126C670.88 126 622.368 103.124 588.488 66.5992C564.609 77.7484 537.952 83.9804 509.832 83.9804C486.086 83.9804 463.383 79.5354 442.515 71.4394C408.919 105.133 362.357 126 310.898 126C264.393 126 221.887 108.959 189.337 80.81C178.194 82.89 166.699 83.9804 154.949 83.9804C90.1777 83.9804 33.1625 50.9253 0 0.837769H1516.5C1482.48 40.7377 1433.24 83.9804 1376.55 83.9804C1350.34 83.9804 1325.41 78.568 1302.81 68.8083Z"
              fill="#FABC2A"
            />
          </svg>
        </div>
      </section>
      <section className="cta" id="contact">
        <div className="ctaStack">
          <h2>Craving Something Different? Pull Up</h2>
          <div className="ctaOrderShell">
            <a
              className="ctaOrder"
              href="https://www.doordash.com/store/johnnys-dirty-soda-1722-w-belmont-ave-chicago-40558927/97830148/"
              target="_blank"
              rel="noopener"
            >
              <img src={A + "03.png"} alt="" />
              <span>Order Now</span>
            </a>
          </div>
          <address>
            <svg viewBox="0 0 17 20" aria-hidden="true">
              <path d="M0.5 6.92285C0.5 11.7747 4.74448 15.7869 6.62319 17.3252C6.89206 17.5454 7.02811 17.6568 7.22871 17.7132C7.38491 17.7572 7.6148 17.7572 7.771 17.7132C7.97197 17.6567 8.10707 17.5463 8.37695 17.3254C10.2557 15.7871 14.4999 11.7751 14.4999 6.9233C14.4999 5.08718 13.7625 3.32605 12.4497 2.02772C11.137 0.729394 9.3566 0 7.50008 0C5.64357 0 3.86301 0.729503 2.55025 2.02783C1.2375 3.32616 0.5 5.08674 0.5 6.92285Z" />
              <path d="M5.5 6C5.5 7.10457 6.39543 8 7.5 8C8.60457 8 9.5 7.10457 9.5 6C9.5 4.89543 8.60457 4 7.5 4C6.39543 4 5.5 4.89543 5.5 6Z" />
            </svg>
            <span>1722 W Belmont Ave, Chicago</span>
          </address>
        </div>
      </section>
      <footer className="siteFooter">
        <div className="footerWave" aria-hidden="true">
          <svg
            viewBox="0 0 1518 108"
            preserveAspectRatio="none"
            width="100%"
            height="100%"
          >
            <path
              d="M1302.81 57.1917C1269.04 21.9552 1221.4 0 1168.62 0C1114.08 0 1065.05 23.4296 1031.12 60.7266C1006.54 48.7468 978.903 42.0196 949.687 42.0196C918.821 42.0196 889.718 49.5287 864.117 62.8076C830.131 24.3041 780.299 0 724.761 0C670.88 0 622.368 22.8759 588.488 59.4008C564.609 48.2516 537.952 42.0196 509.832 42.0196C486.086 42.0196 463.383 46.4646 442.515 54.5606C408.919 20.8667 362.357 0 310.898 0C264.393 0 221.887 17.0407 189.337 45.19C178.194 43.11 166.699 42.0196 154.949 42.0196C90.1777 42.0196 33.1625 57.1532 0 107.241H1518C1483.98 67.3408 1433.24 42.0196 1376.55 42.0196C1350.34 42.0196 1325.41 47.432 1302.81 57.1917Z"
              fill="#FABC2A"
            />
          </svg>
        </div>
        <div className="footerBody">
          <div className="footerContent">
            <a className="footerLogo" href="#top">
              <img src={A + "01.webp"} alt="Johnny's Dirty Soda" />
            </a>
            <nav className="footerNav" aria-label="Footer navigation">
              <a href="#top">Home</a>
              <a href="#sodas">Dirty Sodas</a>
              <a href="#snacks">Exotic Snacks</a>
            </nav>
            <a className="footerPhone" href="tel:312-719-3145">
              312-719-3145
            </a>
            <a className="footerEmail" href="mailto:info@johnnysdirtysoda.com">
              info@johnnysdirtysoda.com
            </a>
            <div className="footerSocials" aria-label="Social media">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12C24 5.373 18.627 0 12 0S0 5.373 0 12c0 5.989 4.388 10.954 10.125 11.854v-8.385H7.078V12h3.047V9.356c0-3.007 1.792-4.688 4.533-4.688 1.312 0 2.686.234 2.686.234v2.953h-1.513c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.989 24 12Z" />
                </svg>
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener"
                aria-label="X"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7.55 21.75c9.055 0 14.008-7.503 14.008-14.008 0-.211-.004-.427-.014-.638A10.02 10.02 0 0 0 24 4.555a9.82 9.82 0 0 1-2.826.773 4.94 4.94 0 0 0 2.165-2.723 9.86 9.86 0 0 1-3.126 1.195 4.92 4.92 0 0 0-8.393 4.49A13.97 13.97 0 0 1 1.673 3.149a4.92 4.92 0 0 0 1.523 6.571 4.88 4.88 0 0 1-2.23-.614v.061a4.92 4.92 0 0 0 3.95 4.828 4.93 4.93 0 0 1-2.221.084 4.93 4.93 0 0 0 4.597 3.422A9.87 9.87 0 0 1 1.177 19.61c-.394 0-.787-.024-1.177-.072a13.93 13.93 0 0 0 7.55 2.212Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/johnnysdirtysoda/"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.161c3.206 0 3.586.014 4.847.07 1.172.052 1.805.249 2.226.413.558.215.961.478 1.379.895.421.422.679.82.895 1.378.164.422.361 1.06.412 2.227.057 1.265.071 1.645.071 4.847 0 3.206-.014 3.586-.071 4.846-.051 1.172-.248 1.805-.412 2.227-.216.558-.478.961-.895 1.378-.422.422-.821.68-1.379.895-.421.165-1.059.361-2.226.413-1.266.056-1.645.07-4.847.07-3.206 0-3.586-.014-4.847-.07-1.172-.052-1.805-.248-2.226-.413-.558-.215-.961-.478-1.379-.895-.421-.422-.679-.82-.895-1.378-.164-.422-.361-1.059-.412-2.227-.057-1.265-.071-1.645-.071-4.846 0-3.207.014-3.586.071-4.847.051-1.172.248-1.805.412-2.227.216-.558.478-.961.895-1.378.422-.422.821-.68 1.379-.895.421-.164 1.059-.361 2.226-.413 1.261-.056 1.641-.07 4.847-.07ZM12 0C8.742 0 8.334.014 7.055.07 5.78.127 4.903.333 4.144.628 3.352.938 2.681 1.345 2.016 2.016 1.345 2.681.938 3.352.628 4.139.333 4.903.127 5.775.07 7.05.014 8.334 0 8.742 0 12s.014 3.666.07 4.945c.057 1.275.263 2.152.558 2.911.31.792.717 1.463 1.388 2.128.665.666 1.336 1.079 2.123 1.383.764.296 1.636.502 2.911.558 1.28.056 1.688.07 4.945.07 3.258 0 3.666-.014 4.946-.07 1.275-.056 2.151-.262 2.911-.558.787-.304 1.457-.717 2.123-1.383.666-.665 1.078-1.336 1.383-2.123.295-.764.501-1.636.558-2.911.056-1.28.07-1.688.07-4.945 0-3.258-.014-3.666-.07-4.946-.057-1.275-.263-2.151-.558-2.911-.295-.796-.703-1.467-1.374-2.132C21.319 1.35 20.648.938 19.861.633 19.097.338 18.225.131 16.95.075 15.666.014 15.258 0 12 0Z" />
                  <path d="M12 5.836A6.164 6.164 0 1 0 12 18.164 6.164 6.164 0 0 0 12 5.836Zm0 10.162A3.998 3.998 0 1 1 12 8.002a3.998 3.998 0 0 1 0 7.996Z" />
                  <circle cx="18.408" cy="5.592" r="1.439" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.223 0H1.772C.792 0 0 .773 0 1.73v20.536C0 23.222.792 24 1.772 24h20.451c.98 0 1.777-.778 1.777-1.73V1.73C24 .773 23.203 0 22.223 0ZM7.12 20.452H3.558V8.995H7.12v11.457ZM5.339 7.434a2.064 2.064 0 1 1 0-4.125 2.064 2.064 0 0 1 0 4.125Zm15.113 13.018h-3.558v-5.569c0-1.327-.024-3.038-1.852-3.038-1.851 0-2.133 1.449-2.133 2.944v5.663H9.356V8.995h3.413v1.566h.047c.473-.9 1.636-1.852 3.365-1.852 3.605 0 4.271 2.372 4.271 5.457v6.286Z" />
                </svg>
              </a>
            </div>
            <small>All Rights Reserved. ©2025</small>
          </div>
        </div>
      </footer>
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
