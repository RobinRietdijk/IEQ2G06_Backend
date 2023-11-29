const indexHandler = {
    GET: (req, res) => {
        res.render('index', { title: 'Express' });
    }
};

export default indexHandler;