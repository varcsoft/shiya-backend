const verifyPinCodeC = async (req, res) => {
  try {
    const faqs = await getAllActiveFaqs();
    return response.sendSuccess(res, 200, "Faqs retrieved", faqs);
  } catch (error) {
    console.error("Error retrieving faqs:", error);
    return response.sendError(res, 500, 1003);
  }
};
export { verifyPinCodeC };
