const generateNumber = () => {
    return `ACCT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

module.exports = {
    generateNumber
}