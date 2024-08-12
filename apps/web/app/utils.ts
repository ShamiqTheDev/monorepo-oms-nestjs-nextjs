export const toTitleCase = (text: string) => {
  const words = text.replace(/_/g, ' ').split(/(?=[A-Z])|\s/);
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

export const toTitleCase2 = (text: string) => {
  return text
    .toLowerCase()
    .split(' ')
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

export const testPassword = (pass: string) => {
  return /^[\x20-\x7E]+$/.test(pass) && pass.length >= 8 && pass.length <= 255;
};
