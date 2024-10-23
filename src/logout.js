exports.logout = (req, res) => {
    // Clear the token by setting it to an empty string and expiring the cookie
    res.clearCookie('token');  // Assuming you stored the token in a cookie
    res.status(200).json({ message: "Logged out successfully!" });
};