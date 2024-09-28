import hexRgb from "hex-rgb";
import plugin from "tailwindcss/plugin";

/**
 * Converts a hexadecimal color code to its RGB channel values as a space-separated string.
 *
 * @param {string} hex - The hexadecimal color code to convert.
 * @returns {string} The RGB channel values as a space-separated string.
 */
const getRgbChannels = (hex) => {
  const { red, green, blue } = hexRgb(hex);
  return `${red} ${green} ${blue}`;
};

/**
 * Recursively generates CSS variable declarations from a nested object of color values.
 *
 * @param {Object} input - The input object containing color values.
 * @param {string[]} [path=[]] - The current path of keys in the input object.
 * @param {Object} [output={}] - The output object to store the generated CSS variable declarations.
 * @returns {Object} The output object containing the generated CSS variable declarations.
 */
const getCSSVariablesDeclarations = (input, path = [], output = {}) => {
  Object.entries(input).forEach(([key, value]) => {
    const newPath = path.concat(key);

    if (typeof value !== "string") {
      getCSSVariablesDeclarations(value, newPath, output);
    } else {
      output[`--${newPath.join("-")}`] = getRgbChannels(value);
    }
  });
  return output;
};

/**
 * Recursively generates an object of CSS variable references from a nested object of color values.
 *
 * @param {Object} input - The input object containing color values.
 * @param {string[]} [path=[]] - The current path of keys in the input object.
 * @returns {Object} An object containing CSS variable references for the input color values.
 */
const getCSSVariables = (input, path = []) => {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => {
      const newPath = path.concat(key);
      if (typeof value !== "string") {
        return [key, getCSSVariables(value, newPath)];
      } else {
        return [key, `rgb(var(--${newPath.join("-")}) / <alpha-value>)`];
      }
    })
  );
};

/**
 * Checks if the provided `colorThemes` object contains at least one valid theme object.
 *
 * @param {Object} input - The `colorThemes` object to check.
 * @throws {Error} If the `colorThemes` object does not contain at least one valid theme object.
 */
const checkForThemeValidExist = (input) => {
  const isThemeExist =
    typeof input === "object" &&
    Object.keys(input).some((key) => typeof input[key] === "object");

  if (!isThemeExist) {
    throw new Error(
      "The Multi-Theme Plugin expects a `colorThemes` option passed to it, which contains at least one theme object."
    );
  }
};

export default plugin.withOptions(
  function (options) {
    const { colorThemes } = options;
    checkForThemeValidExist(colorThemes);

    return ({ addBase }) => {
      addBase({
        ":root": getCSSVariablesDeclarations(Object.values(colorThemes)[0]),
      });
      Object.entries(colorThemes).forEach(([key, value]) => {
        addBase({
          [`[data-theme="${key}"]`]: getCSSVariablesDeclarations(value),
        });
      });
    };
  },
  function (options) {
    const { colorThemes } = options;
    checkForThemeValidExist(colorThemes);

    return {
      theme: {
        extend: {
          colors: getCSSVariables(Object.values(colorThemes)[0]),
        },
      },
    };
  }
);
