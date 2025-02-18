import { gsap } from "gsap";

import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger,CustomEase);

/**
 * Animates the loader.
 * @function startLoader
 */
export function startLoader() {
    // Lock the scroll
    document.body.style.overflow = "hidden";

    const svg = document.querySelector<SVGSVGElement>(".loader_logo svg");

    const paths = document.querySelectorAll<SVGPathElement>(".loader_logo svg path");

    const bars = document.querySelectorAll<HTMLElement>(".loader_column");

    const headerSpans = document.querySelectorAll<HTMLElement>(".hero_heading > span");

    const footnotes = document.querySelectorAll<HTMLElement>(".hero_footnote");

    if (svg) {
        svg.style.overflow = "visible";
    }

    // Animate the paths
    paths.forEach((path) => {
        path.style.filter = "blur(0px)";
        path.style.opacity = "0";
    });

    // Animate the header spans
    headerSpans.forEach(path => path.style.filter = "blur(0px)");
    headerSpans.forEach(path => path.style.display = "inline-block");

    // Animate the footnotes
    footnotes.forEach(path => path.style.filter = "blur(0px)");

    CustomEase.create("easing", "0.33, 1, 0.68, 1");
    CustomEase.create("easeOutQuint", "0.7, 0, 0.84, 0");

    const timeline = gsap.timeline({
        ease: "power1.inOut",
        duration: 1,
        onComplete: () => {
            document.body.style.overflow = ""; // Unlock the scroll when the animation is complete
        },
    });

    timeline.timeScale(1.3);

    // Animate the paths
    timeline.
        fromTo(
            paths,
            { duration: 0.8, y: 30, opacity: 0, webkitFilter: "blur(10px)", ease: "easing", },
            { duration: 0.8, y: 0, opacity: 1, webkitFilter: "blur(0px)", ease: "easing", stagger: { amount: 0.1 } }
        )
        .to(
            paths,
            { duration: 0.8, y: -30, opacity: 0, webkitFilter: "blur(10px)", ease: "easing", stagger: { amount: 0.1 } },
            "+=0.8"
        )
        .to(
            bars,
            { duration: 0.6, height: 0, ease: "easing", stagger: { amount: 0.4 } },
            "-=.8"
        )
        .from(
            headerSpans,
            { duration: 0.8, y: 100, opacity: 0, webkitFilter: "blur(10px)", ease: "easing", stagger: { amount: 0.2 } },
            "-=0.8"
        )
        .from(
            footnotes,
            { duration: 0.4, y: "2rem", opacity: 0, webkitFilter: "blur(4px)", ease: "easing", stagger: { amount: 0.2 } },
            "-=0.6"
        )
        .from(
            ".hero_highlight",
            { duration: 0.8, right: "100%", ease: "easing", },
            "-=0.7"
        )
        .fromTo(
            '.hero_container',
            { height: "100vh" },
            { height: 'auto', duration: .8, easing: "easeOutQuint" },
            "-=0.4"
        );
}

/**
 * Animates the navigation bar.
 * @function animateNav
 */
export function animateNav() {
    gsap.registerPlugin(ScrollTrigger);

    const navbar = document.querySelector<HTMLElement>('.navigation_section');

    if (!navbar) return;

    const masterTimeline = gsap.timeline({
        ease: "none",
        // When the navbar reaches the top of the viewport, animate the logo
        scrollTrigger: {
            trigger: navbar,
            start: "top -10%",
            end: "top -20%",
            scrub: true,
        },
    });

    // Animate the logo size
    masterTimeline
    // .set('#daily-design', {clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'})
    .to(":root", { "--util--nav-logo": "4rem" })
    .to('#nav-design-group', { yPercent: -120, opacity: 0})

    const stackingSection = document.querySelector<HTMLElement>('[data-section="stacking"]');

    if (!stackingSection) return;

    // Animate the navbar out of the viewport when the stacking section is scrolled into view
    gsap.to(navbar, {
        y: -navbar.offsetHeight,
        ease: "none",
        // When the stacking section is scrolled into view, animate the navbar
        scrollTrigger: {
            trigger: stackingSection,
            start: `top ${window.innerHeight * 0.5}px`,
            end: `top ${window.innerHeight * 0.5 - navbar.offsetHeight}px`,
            scrub: true,
        }
    })
}

export function stackingAnimation() {
    // Helper function to convert CSS variables to pixel values
    function getVarInPixels(varName: string): number {
        const testElem = document.createElement('div');
        testElem.style.position = 'absolute';
        testElem.style.visibility = 'hidden';
        testElem.style.height = `var(${varName})`;
        document.body.appendChild(testElem);

        const computedHeight = getComputedStyle(testElem).height;
        const valueInPixels = parseFloat(computedHeight);

        document.body.removeChild(testElem);
        return valueInPixels;
    }

    const padding = getVarInPixels('--insets--xx-lg');
    const lineHeight = getVarInPixels('--typography--fonts-size--h2');

    // Create a gsap.matchMedia instance
    const mm = gsap.matchMedia();

    // Define responsive animations
    mm.add(
        // For viewports at least 1024px wide
        "(min-width: 1024px)", () => {
            const sections = document.querySelectorAll<HTMLElement>('[data-section]');

            sections.forEach((section, i) => {
                const isFirst = i === 0;
                const prevHeight = isFirst ? 0 : (sections[i - 1] as HTMLElement).offsetHeight;
                const offset = prevHeight - (2 * padding) - (1.2 * lineHeight);

                gsap.to(section, {
                    marginTop: isFirst ? 0 : -offset,
                    scrollTrigger: {
                        trigger: section,
                        start: `top ${window.innerHeight - padding * 3}px`,
                        end: `top ${window.innerHeight * 0.5}px`,
                        scrub: true,
                    },
                });

            });

            // Refresh ScrollTrigger on resize to ensure correct measurements
            window.addEventListener('resize', () => ScrollTrigger.refresh());
        },
    );
}