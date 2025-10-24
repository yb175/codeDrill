async function runcustomInput(req, res) {
    try{
        const { code, language, testCase } = req.body;
        if (!code || !language) {
            res.status(404).json({
                success: false,
                message: "Fields missing",
            })
        }
        const languageId = getLanguageCode(language);
        if (!languageId) {
            res.status(404).json({
                success: false,
                message: "Language not supported",
            });
        }
        const problem = req.problem ; 
        const ogcode = problem.refrenceSol ; 
        
    }catch(err){
        res.status(500).json({
            success : false , 
            message : err.message 
        })
    }
}