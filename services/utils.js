// Handle API response
handleResponse = (req, res, statusCode, data, message) => {
  let isError = false;
  let errorMessage = message;

  switch (statusCode) {
    case 204:
      return res.sendStatus(204);
    case 400:
      isError = true;
      break;
    case 401:
      isError = true;
      errorMessage = message || 'Unauthorized';
      break;
    case 403:
      isError = true;
      errorMessage = message || 'User is not authorized to access this resource with an explicit deny.';
      break;
    default:
      break;
  }

  const resObj = data || {};

  if (isError) {
    resObj.error = true;
    resObj.message = errorMessage;
  }

  return res.status(statusCode).json(resObj);
};

module.exports = {
  handleResponse,
};
