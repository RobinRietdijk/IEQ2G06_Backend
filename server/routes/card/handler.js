const cardhandler = {
    GET: (req, res) => {
        res.render('index', { color: req.params.color, poem: req.params.poem });
    },
};

export default cardhandler;