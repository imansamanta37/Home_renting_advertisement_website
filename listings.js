const Listing= require("../Models/listing");
module.exports.index = async (req,res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
}
module.exports.renderNewForm = async (req,res)=>{
    if(!req.isAuthenticated())
    {
        
        console.log(res.locals.originalUrl);
        req.flash("error","you must be log in before creting listing");

        return res.redirect("/auth/login");
    }
    res.render("listings/new.ejs");
}
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}
module.exports.createNewListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url);
    console.log(req.body);

    //  let result =await Listing.validate(req.body);
    //  if(result.error){
    //      throw new ExpressError(400,result.error);
    // //  };
    //  console.log(result);
     const newListing = new Listing(req.body.listing);
     newListing.image = {url,filename};
     newListing.owner = req.user._id;
     await newListing.save();
     req.flash("success","New listing created");
     res.redirect("/listings")
 

 // let {title,description,image,price,country,location} = req.body;

}
module.exports.editListingForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
   }
module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(req.body.listing);
    res.redirect("/listings");
   }