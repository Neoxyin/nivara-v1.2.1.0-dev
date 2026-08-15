import gsap from 'gsap';

export { gsap };

export const EASINGS = {
  smooth: 'power3.out',
  snappy: 'power4.out',
  elastic: 'elastic.out(1, 0.75)',
  soft: 'expo.out',
  bounce: 'back.out(1.7)',
};

/**
 * Animate numbers counting up smoothly
 */
export function animateCounter(
  target: { val: number },
  endValue: number,
  onUpdate: () => void,
  duration = 1.2,
  ease = 'power2.out'
) {
  return gsap.to(target, {
    val: endValue,
    duration,
    ease,
    onUpdate,
  });
}
