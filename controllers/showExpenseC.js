

export const showUserExpense = async (req,res) => {
    try {
        console.log('show expense calll');
        
        res.status(201).json({data:"Ok"})
    } catch (error) {
        res.status(401).json({error:error})
    }
} 

