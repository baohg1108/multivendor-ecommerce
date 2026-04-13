import { Color } from "./../node_modules/colorthief/src/types";
declare module "colorthief" {
  interface ColorThief {
    getColor(image: HTMLImageElement | string, quality?: number): number[];
    getPalette(
      image: HTMLImageElement | string,
      colorCount?: number,
      quantity?: number,
    ): number[][];
  }

  const ColorThief: {
    new (): ColorThief;
  };

  export default ColorThief;
}
