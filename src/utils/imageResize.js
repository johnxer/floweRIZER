export const resizeImageBitmap = async (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8, outputType = 'image/webp') => {
    const bitmap = await createImageBitmap(file);

    let { width, height } = bitmap;

    if (width > height && width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
    } else if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
    }

    console.log(width, height)

    const canvas =
        typeof OffscreenCanvas !== 'undefined'
            ? new OffscreenCanvas(width, height)
            : (() => {
                  const c = document.createElement('canvas');
                  c.width = width;
                  c.height = height;
                  return c;
              })();

    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = canvas instanceof OffscreenCanvas ? await canvas.convertToBlob({ type: outputType, quality }) : await new Promise((resolve) => canvas.toBlob(resolve, outputType, quality));

    return new File([blob], `${file.name.replace(/\.[^/.]+$/, '')}_${width}x${height}.webp`, { type: outputType });
};
