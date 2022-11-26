const cookieset = async(req , res, next)=>{
    try {
        const check = req.body.checkbox;
        console.log(check);
       
       var cookie = req.cookies.cookieName;
        if (cookie === undefined) {
          // no: set a new cookie
          var randomNumber=Math.random().toString();
          randomNumber=randomNumber.substring(2,randomNumber.length);
          if(check){
          res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
          console.log('cookie created successfully');
          }
        } else {
          // yes, cookie was already present 
          console.log('cookie exists', cookie);
          res.render('dashboard');
        } 
   
        next();
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    cookieset
}