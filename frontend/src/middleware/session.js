const authSession = async (req, res, next) => {
  if (!req.session.jwtToken) {
    try {
      const response = await fetch(`${process.env.RESERVATION_API}/token`, { method: 'post' });
      console.log(`[authSession] token response status: ${response.status}`);
      const backendToken = await response.text();

      if (backendToken) {
        req.session.jwtToken = backendToken;
        console.log('[authSession] token stored in session');
      } else {
        console.warn('[authSession] token response was empty');
      }
    } catch (error) {
      console.error('[authSession] error fetching token:', error.message);
    }
  }

  next();
};

export { authSession };
