export const toTitleCase = (input: string) => {
  return input.replace(
    /\w\S*/g,
    word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
};
