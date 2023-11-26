const indexHandler = {
    GET: (req, res) => {
        res.status(200).json({ message: 'OK' })
    }
};

export default indexHandler;