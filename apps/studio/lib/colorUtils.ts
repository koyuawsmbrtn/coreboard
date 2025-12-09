import { brandColors, primitives, variables } from '@repo/ui'

export const createColorList = () => {
  // Flatten primitives into a single object
  const flatPrimitives = Object.entries(primitives).reduce((acc, [category, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      acc[`${category}-${shade}`] = value;
    });
    return acc;
  }, {} as Record<string, string>);

  const allColors = { ...flatPrimitives, ...variables, ...brandColors };

  return Object.entries(allColors).map(([key, value]) => ({
    label: key.replace(/[-_]/g, ' ').replace(/^\w/, c => c.toUpperCase()),
    value: value as string
  }));
};
