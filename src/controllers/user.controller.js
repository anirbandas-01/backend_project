import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler ( async (req, res) => {

     console.log("req.files:", req.files);
    console.log("req.body:", req.body);

//get user details from frontend
//validation -not empty
//check if user already exists: username, email
//check for images, check for avatar
//check them to cloudinary, avatar
//crete user object - create entry in db
//remove password and refresh token from password
//check for user creation
//return response

/* console.log("req.body:", req.body);

 const {fullname, username, email, password} = req.body;
      
  if( !fullname || !username || !email || !password ){
    return res.status(400).json({
        success: false,
        message: "ALL fields are required"
    });
}
       res.status(200).json({
        success: true,
        message: "User data received",
        data: { fullname, username, email }
       }); */
       
       const { fullname, username, email, password}  = req.body;
      /* console.log("email:", email);
        */

       /* // validation using ApiError
            if (!fullname || !username || !email || !password) {
            throw new ApiError(400, "All fields (fullname, username, email, password) are required");
             }
         */
        if (!fullname || fullname.trim() === "") {
           throw new ApiError(400, "Full name is required");
           }
        if (!username || username.trim() === "") {
            throw new ApiError(400, "Username is required");
            }
        if (!email || email.trim() === "") {
           throw new ApiError(400, "Email is required");
            }
        if (!password || password.trim() === "") {
           throw new ApiError(400, "Password is required");
            }

        
        const existedUser = await User.findOne({ 
            $or: [{ email }, { username }]
        })

        if (existedUser) {
            throw new ApiError(409, "User already exits with this email or username");
        }

        const avatarLocalPath = req.files?.avatar[0]?.path;

        let coverImageLocalPath;
        if(req.files && Array.isArray(req.files.coverImage) && req.files.length > 0) {
               coverImageLocalPath = req.files.coverImage[0].path;
        }

        if (!avatarLocalPath){
            throw new ApiError(400, "Avatar file is required")
        }
         
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)
        

        if (!avatar){
            throw new ApiError(400, "Avatar file is required")
        }

        const user = await User.create({
            fullname,
            avatar: avatar,
            coverImage: coverImage?.url || "",
            //coverImage: coverImage || "",
            username: username.toLowerCase(),
            email,
            password
        })
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            throw new ApiError(500, "Something went wrong while registering the user")
        }

        return res.status(201).json(
            new ApiResponse(201, createdUser, "User registered Successfully")
        )
});


export { registerUser }


