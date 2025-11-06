export default  function checkUser(req, res) {
    res.status(200).json({
        success : true , 
        data : {
            email : req.result.email , 
            role : req.result.role,
            name : req.result.name
        }
    });
}