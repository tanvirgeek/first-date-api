export const signup = async (req, res) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body
    } catch (error) {

    }
}

export const signin = (req, res) => {
    res.send("sign in users")
}

export const signout = (req, res) => {
    res.send("sign out users")
}