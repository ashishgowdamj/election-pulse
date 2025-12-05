const BASE_ANIMATION = {
  isAnimationActive: true,
  animationBegin: 200,
  animationDuration: 900,
  animationEasing: 'ease-out' as const,
};

export const PIE_ANIMATION_PROPS = {
  ...BASE_ANIMATION,
};

export const BAR_ANIMATION_PROPS = {
  ...BASE_ANIMATION,
};
