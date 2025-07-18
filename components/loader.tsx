"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loader = ({ className }: { className?: string }) => (
  <DotLottieReact
    src="https://lottie.host/6e8e8cec-5092-421a-8a89-91b47caec552/laFwl3flZ9.lottie"
    loop
    autoplay
    className={className}
  />
);
Loader.displayName = "Loader";

export { Loader };
