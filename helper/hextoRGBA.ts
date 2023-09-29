export function hexToRGBA(hex: string, alpha: number): string {
    // Remove '#' if present
    hex = hex.replace("#", "");
  
    // Convert 3-digit hex to 6-digit hex
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
  
    // Parse hex values
    const red = parseInt(hex.substring(0, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue = parseInt(hex.substring(4, 6), 16);
  
    // Build the RGBA value
    const rgba = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  
    return rgba;
  }
  
  // Example usage
  const hexColor = "#FF0000";
  const alphaValue = 0.5;
  const rgbaColor = hexToRGBA(hexColor, alphaValue);  