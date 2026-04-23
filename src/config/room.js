function generateRoomId(userId) {
  const now = Date.now(); // current timestamp in ms
  const random = Math.floor(Math.random() * 1e6); // extra randomness
  return `${userId}-${now}-${random}`;
}

export { generateRoomId };
