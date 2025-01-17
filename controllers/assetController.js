class AssetController {
    static async getAsset (req,res){
        try{
            return res.render('users_management/asset');
        }catch (err) {
            // Tangani error dan lempar ke global error handler
            next(err);
          }
        
    }
}
module.exports = AssetController;