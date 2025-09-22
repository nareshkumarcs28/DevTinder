const adminAuth = (req, res, next) => {
    res.send("Admin Auth is getting checked!");
    const token = "xyz"; // example token
    const isAdminAuthorised = token === "xyz"; // ✅ fix logic
    if (!isAdminAuthorised) {
        return res.status(401).send("Unauthorized request!");
    }
    next();
};

const userAuth = (req, res, next) => {
    console.log("User Auth is getting checked!");
    const token = "xyz";
    const isUserAuthorised = token === "xyz"; // ✅ keep logic correct
    if (!isUserAuthorised) {
        return res.status(401).send("Unauthorized request!");
    }
    next();
};

module.exports = { adminAuth, userAuth };
