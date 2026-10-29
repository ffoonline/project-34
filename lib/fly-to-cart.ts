export function flyProductToCart(
  imageSrc: string,
  origin: EventTarget | null,
  onArrive?: () => void,
) {
  if (typeof window === "undefined") {
    onArrive?.();
    return;
  }

  const from = origin instanceof Element ? origin : null;
  const cart = document.querySelector("[data-cart-dock]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!from || !cart || reduced) {
    onArrive?.();
    return;
  }

  const start = from.getBoundingClientRect();
  const end = cart.getBoundingClientRect();
  const size = 56;
  const startX = start.left + start.width / 2 - size / 2;
  const startY = start.top + start.height / 2 - size / 2;
  const dx = end.left + end.width / 2 - (startX + size / 2);
  const dy = end.top + end.height / 2 - (startY + size / 2);

  const flyer = document.createElement("img");
  flyer.src = imageSrc;
  flyer.alt = "";
  flyer.width = size;
  flyer.height = size;
  flyer.setAttribute("data-cart-flyer", "");
  Object.assign(flyer.style, {
    position: "fixed",
    left: `${startX}px`,
    top: `${startY}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: "cover",
    borderRadius: "6px",
    zIndex: "80",
    pointerEvents: "none",
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
  });
  document.body.appendChild(flyer);

  const animation = flyer.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      {
        transform: `translate(${dx * 0.55}px, ${dy * 0.35 - 48}px) scale(0.72)`,
        opacity: 1,
        offset: 0.55,
      },
      { transform: `translate(${dx}px, ${dy}px) scale(0.18)`, opacity: 0.35 },
    ],
    { duration: 720, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
  );

  const finish = () => {
    flyer.remove();
    cart.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.18)" },
        { transform: "scale(1)" },
      ],
      { duration: 280, easing: "ease-out" },
    );
    onArrive?.();
  };

  animation.finished.then(finish).catch(finish);
}
