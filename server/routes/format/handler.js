const formatHandler = {
    GET: (req, res) => {
        res.render('card', { title: 'Card template' })
    },
    POST: (req, res) => {
        res.status(200).send()
    }
};

export default formatHandler;