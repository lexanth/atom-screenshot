"use babel";

import sharp from 'sharp';
const { nativeImage } = require("electron");

export default class Processor {
  constructor() {

  }

  process(image, cb) {
    const cornerRadius = atom.config.get('screenshot.cornerRadius');
    if (cornerRadius) {
      const size = image.getSize();
      const data = image.toDataURL();
      const roundedCorners = Buffer.from(`
        <svg><rect
          x="0"
          y="0"
          width="${size.width}"
          height="${size.height}"
          rx="${cornerRadius}"
          ry="${cornerRadius}"
        /></svg>
      `);
      sharp(image.toPNG())
        .overlayWith(roundedCorners, {cutout: true})
        .png()
        .toBuffer()
        .then(data => {
          cb(null, nativeImage.createFromBuffer(data, size));
        })
        .catch(err => {
          cb(err);
        })

    } else {
      cb(null, image);
    }
  }
}
