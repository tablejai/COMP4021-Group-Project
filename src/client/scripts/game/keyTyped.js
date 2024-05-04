function handleKeyPress(key) {
  switch (key) {
    case "a": // move block to the left
      return { action: "LEFT" };
    case "d": // move block to the right
      return { action: "RIGHT" };
    case "q": // rotate block counter clockwise
      return { action: "ROTANTI" };
    case "e": // rotate block clockwise
      return { action: "ROT" };
    case "s":
      return { action: "DOWN" };
    case " ":
      return { action: "DROP" };
    case "c":
      return { action: "CHEAT" };
    default:
      return {};
  }
}
