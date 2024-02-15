const authSession = async (req, res, next) => {
  if (!req.session.jwtToken) {
    try {
      // If the token is not in the session, or it has expired, get a new one
      const response = await fetch(`${process.env.RESERVATION_API}/token`, { method: 'post' });
      const backendToken = await response.text(); // Extract token from response

      if (backendToken) {
        req.session.jwtToken = backendToken;
      }
    } catch (error) {
      console.error('Error fetching token from backend:', error);
    }
  }

  next();
};

export { authSession };
