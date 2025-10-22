async function runcustomInput(req, res) {
    try{
        const { code, problemNumber, language } = req.body;
    }catch(err){
        res.status(500).json({
            success : false , 
            message : err.message 
        })
    }
}